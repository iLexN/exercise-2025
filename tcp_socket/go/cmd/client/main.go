package main

import (
    "context"
    "encoding/json"
    "fmt"
    "github.com/redis/go-redis/v9"
    "net"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

var ctx = context.Background()

// StockUpdate represents the structure of the stock update message
type StockUpdate struct {
    Symbol string  `json:"symbol"`
    Price  float64 `json:"price"`
}

// Configuration constants
const (
    serverAddress  = "localhost:9501"
    redisAddress   = "localhost:6379"
    reconnectDelay = 5 * time.Second
)

func main() {
    // Connect to Redis
    rdb := redis.NewClient(&redis.Options{
        Addr: redisAddress, // Redis server address
    })

    // Set up signal handling for graceful shutdown
    signalChan := make(chan os.Signal, 1)
    signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

    // Start the HTTP server in a separate goroutine
    go startHTTPServer(rdb)

    // Start the TCP connection with retry logic in a separate goroutine
    go connectToTCPServer(rdb)

    // Wait for shutdown signal
    <-signalChan
    fmt.Println("Shutting down gracefully...")



    // Delay for 5 seconds before exiting
    time.Sleep(5 * time.Second)
    fmt.Println("Shutdown complete.")
}


// connectToTCPServer handles the TCP connection and message processing
func connectToTCPServer(rdb *redis.Client) {
    for {
        // Connect to the TCP server
        conn, err := net.Dial("tcp", serverAddress)
        if err != nil {
            fmt.Println("Error connecting to server:", err)
            fmt.Println("Retrying in 5 seconds...")
            time.Sleep(reconnectDelay) // Wait before retrying
            continue
        }

        // Read the server's periodic messages
        buffer := make([]byte, 1024)
        for {
            n, err := conn.Read(buffer)
            if err != nil {
                fmt.Println("Connection lost, reconnecting...")
                conn.Close() // Close the connection explicitly before breaking
                break // Exit the inner loop to reconnect
            }

            // Process the received message
            serverMessage := string(buffer[:n])
            fmt.Println("Server response:", serverMessage)

            // Cache the message in Redis
            cacheMessage(rdb, serverMessage)
        }
        // The connection is closed here after the inner loop ends
    }
}

// startHTTPServer starts the HTTP server with an SSE endpoint
func startHTTPServer(rdb *redis.Client) {
    http.HandleFunc("/sse", func(w http.ResponseWriter, r *http.Request) {

        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:63342") // Allow all origins
        w.Header().Set("Access-Control-Allow-Methods", "GET")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight requests
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return // Respond to preflight requests
        }

        w.Header().Set("Content-Type", "text/event-stream")
        w.Header().Set("Cache-Control", "no-cache")
        w.Header().Set("Connection", "keep-alive")

        // Keep the connection open
        flusher, ok := w.(http.Flusher)
        if !ok {
            http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
            return
        }

        // Send updates from Redis periodically
        ticker := time.NewTicker(1 * time.Second)
        defer ticker.Stop()

        for {
            select {
            case <-r.Context().Done():
                return // Client disconnected
            case <-ticker.C:
                sendRedisData(rdb, w)
                flusher.Flush() // Flush the buffer to the client
            }
        }
    })

    fmt.Println("HTTP server started on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        fmt.Println("HTTP server error:", err)
    }
}

// sendRedisData retrieves data from Redis and sends it to the client
func sendRedisData(rdb *redis.Client, w http.ResponseWriter) {
    keys, err := rdb.Keys(ctx, "tcp.data.*").Result()
    if err != nil {
        fmt.Println("Error retrieving keys from Redis:", err)
        return
    }

    var stockUpdates []StockUpdate

    for _, key := range keys {
        data, err := rdb.Get(ctx, key).Result()
        if err == nil {
            var stockUpdate StockUpdate
            if json.Unmarshal([]byte(data), &stockUpdate) == nil {
                stockUpdates = append(stockUpdates, stockUpdate)
            }
        }
    }

    // Marshal the stock updates to JSON
    jsonResponse, err := json.Marshal(stockUpdates)
    if err != nil {
        fmt.Println("Error marshaling JSON:", err)
        return
    }

    // Send the JSON response as SSE
    fmt.Fprintf(w, "data: %s\n\n", jsonResponse)
}

// cacheMessage stores the message in Redis with the appropriate key
func cacheMessage(rdb *redis.Client, message string) {
    var stockUpdate StockUpdate
    if err := json.Unmarshal([]byte(message), &stockUpdate); err != nil {
        fmt.Println("Error unmarshaling message:", err)
        return
    }

    key := "tcp.data." + stockUpdate.Symbol
    err := rdb.Set(ctx, key, message, 0).Err() // Cache indefinitely
    if err != nil {
        fmt.Println("Error caching message in Redis:", err)
    } else {
        fmt.Printf("Cached message for key %s\n", key)
    }
}
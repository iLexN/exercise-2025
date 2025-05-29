package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"sync"
	"time"
)

type StockUpdate struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
}

var (
	clients   = make(map[net.Conn]struct{}) // Connected clients
	clientsMu sync.Mutex                    // Mutex to protect access to the clients map
	messages  = make(chan string)           // Channel for broadcasting messages
	quit      = make(chan struct{})         // Channel for graceful shutdown
)

func main() {

	port := ":9501" // Configuration for the server port

	// Start the TCP server
	listener, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
	defer listener.Close()

	log.Printf("Server listening on port %s", port)

	go messageBroadcaster()

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Error accepting connection: %v", err)
			continue
		}

		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	// Register the new client
	clientsMu.Lock()
	clients[conn] = struct{}{}
	clientsMu.Unlock()

	log.Printf("Client connected: %s", conn.RemoteAddr())

	// Remove the client from the list when done
	defer func() {
		clientsMu.Lock()
		delete(clients, conn)
		clientsMu.Unlock()
		log.Printf("Client disconnected: %s", conn.RemoteAddr())
	}()

	// Read data from the client
	buffer := make([]byte, 1024)
	for {
		n, err := conn.Read(buffer)
		if err != nil {
			return // Exit if there's an error (client disconnected)
		}
		receivedMessage := string(buffer[:n])
		log.Printf("Received from %s: %s", conn.RemoteAddr(), receivedMessage)

		// Respond to the client
		response := "Hello from server"
		_, err = conn.Write([]byte(response))
		if err != nil {
			log.Printf("Error sending message to %s: %v", conn.RemoteAddr(), err)
			return
		}
	}
}

func messageBroadcaster() {
	for {
		select {
		case <-quit:
			return
		default:
			message := getMessage()
			broadcastMessage(message)
			time.Sleep(2 * time.Second)
		}
	}
}

// broadcastMessage sends the same message to all connected clients
func broadcastMessage(message string) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for client := range clients {
		_, err := client.Write([]byte(message))
		if err != nil {
			log.Printf("Error sending message to client: %v", err)
			client.Close()
			delete(clients, client) // Remove the client if there's an error
		} else {
			log.Printf("Sent to client: %s", message)
		}
	}
}

// getMessage creates a random stock symbol and price and returns it as a JSON string
func getMessage() string {

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	symbols := []string{"AAPL", "GOOGL", "AMZN", "MSFT", "TSLA"}
	symbol := symbols[r.Intn(len(symbols))]
	price := r.Float64()*100 + 100 // Price between 100 and 200

	stockUpdate := StockUpdate{
		Symbol: symbol,
		Price:  price,
	}

	jsonData, err := json.Marshal(stockUpdate)
	if err != nil {
		log.Printf("Error marshaling JSON: %v", err)
		return "{}" // Return an empty JSON object on error
	}

	return string(jsonData)
}

// Shutdown the server gracefully
func shutdown() {
	close(quit) // Signal the broadcaster to stop
	for client := range clients {
		client.Close() // Close all client connections
	}
	log.Println("Server shutting down...")
}

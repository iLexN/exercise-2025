<?php
// Create a TCP client
$client = new Swoole\Client(SWOOLE_SOCK_TCP);

// Set the client to non-blocking mode
$client->set([
    'open_tcp_nodelay' => 1, // Optional: Disable Nagle's algorithm for low-latency communication
    'timeout' => 0.5,
    'connect_timeout' => 1.0,
    'write_timeout' => 10.0,
    'read_timeout' => 0.5,
]);

// Connect to the server
if (!$client->connect("127.0.0.1", 9501, 0.5)) {
    echo "Connection failed: {$client->errCode}\n";
    exit(1);
}

// Send an initial message to the server
$initialMessage = "Hello, Server from PHP!";
$client->send($initialMessage);
echo "Sent: {$initialMessage}\n";

// Use a loop to continuously receive messages
while (true) {
    // Check if there's data to read
    $data = $client->recv(); // Non-blocking receive
    if ($data === false) {
        // Check if there's an error
        if ($client->errCode !== 0) {
            echo "Receive failed: {$client->errCode}\n";
            break; // Exit loop on error
        }
        sleep(2); // Sleep for a short period to avoid busy waiting
        continue; // No data available, continue the loop
    }
    echo "Received: {$data}\n";
    sleep(2);
}

// Close the connection
$client->close();
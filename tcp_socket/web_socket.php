<?php
// Create a TCP server
$server = new Swoole\Server("127.0.0.1", 9501);

// Set the server configurations
$server->set([
    'worker_num' => 4, // Number of worker processes
]);

// Event: when a new connection is established
$server->on('connect', function ($server, $fd) {
    echo "Client {$fd} connected.\n";
});

// Event: when data is received from the client
$server->on('receive', function ($server, $fd, $reactorId, $data) {
    echo "Received from {$fd}: {$data}\n";
    // Sending response back to the client
    $response = "Server: " . trim($data);
    $server->send($fd, $response);
});

// Event: when a connection is closed
$server->on('close', function ($server, $fd) {
    echo "Client {$fd} disconnected.\n";
});

// Start the server
$server->start();
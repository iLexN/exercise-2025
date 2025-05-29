<?php
// Create a TCP server
$server = new Swoole\Server("127.0.0.1", 9501);

// Store connected clients
$clients = [];

// Set the server configurations
//$server->set([
////    'worker_num' => 1, // Set to 1 for easier debugging
////    'enable_coroutine' => true, // Disable coroutine for simpler debugging
////    'hook_flags' => SWOOLE_HOOK_ALL,
//]);

var_dump( swoole_cpu_num());


// Event: when data is received from the client
$server->on('receive', function ($server, $fd, $reactorId, $data) use (&$clients) {
    echo "Received from {$fd}: {$data}\n";
    echo('received'. PHP_EOL);
    // Sending a response back to the client
    $response = "Server: ".trim($data);
    $server->send($fd, $response);
});

// Listen to the WebSocket message event.
$server->on('Message', function ($ws, $frame) {
    echo "Message: {$frame->data}\n";
    echo('message'. PHP_EOL);
    $ws->push($frame->fd, "server: {$frame->data}");
});


// Handle client connections
$server->on('connect', function ($server, $fd) use (&$clients) {
    echo "Client {$fd} connected\n";
    $clients[$fd] = [
        'connected' => true,
        'connected_at' => time(),
        'last_seen' => time()
    ];
    echo "Total clients: ".count($clients)."\n";

    // Debug output
    echo "Current clients array: ";
    print_r(array_keys($clients));
    echo "\n";
});

// Handle client disconnections
$server->on('close', function ($server, $fd) use (&$clients) {
    echo "Client {$fd} disconnected\n";
    if (isset($clients[$fd])) {
        unset($clients[$fd]);
    }
    echo "Total clients: ".count($clients)."\n";
});

// Using a timer to send messages to clients
Swoole\Timer::tick(500, function () use ($server, &$clients) {



    echo "\n=== Timer Tick ===\n";
    echo "Active clients: ".count($clients)."\n";
    echo "Client list: ".implode(', ', array_keys($clients))."\n";

    // Check if the $clients array is populated
    if (empty($clients)) {
        echo "No clients connected\n";
        return;
    }


    foreach ($clients as $fd => $client) {
        // Check if the client is still connected
        $priceUpdate = \random_int(100, 200); // Simulated stock price
        $s = [
            'AAPL',
            'GOOGL',
            'AMZN',
            'MSFT',
            'TSLA',
        ];
        $r = new \Random\Randomizer();
        $keys = $r->pickArrayKeys($s, 1);
        $data = json_encode(['symbol' => $s[$keys[0]], 'price' => $priceUpdate]);
        var_dump($data);

        $server->send($fd, $data . PHP_EOL);

    }
});


// Start the server
$server->start();
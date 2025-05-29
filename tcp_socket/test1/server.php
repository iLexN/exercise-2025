<?php
$server = new Swoole\WebSocket\Server("127.0.0.1", 9502);

// Set the server configurations
$server->set([
    'worker_num' => 4, // Number of worker processes
]);

$server->on('open', function ($server, $request) {
    echo "Client {$request->fd} connected.\n";
});



// Simulate stock price updates
$server->on('message', function ($server, $frame) {
    // Logic to update stock prices
    // Notify all clients about the update
    $server->push($frame->fd, 'pongs');
});



// Use a timer to periodically update stock prices
Swoole\Timer::tick(1000, function() {
echo('here'. PHP_EOL);
global $server;
//    var_dump($server->connections);
    foreach ($server->connections as $connection) {
        var_dump('con');
        $priceUpdate = rand(100, 200); // Simulated stock price

        $s = [
            'AAPL',
            'GOOGL',
            'AMZN',
            'MSFT',
            'TSLA',
        ];
        $r = new \Random\Randomizer();
        $keys = $r->pickArrayKeys($s, 1);
var_dump($connection);
$data = json_encode(['symbol' => $s[$keys[0]], 'price' => $priceUpdate]);
var_dump($data);
        $server->push($connection, $data);
    }
});

$server->on('close', function ($server, $fd) use (&$clients) {
    unset($clients[$fd]);
    echo "Client {$fd} disconnected.\n";
});

$server->start();
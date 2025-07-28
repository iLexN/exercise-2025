<?php
declare(strict_types=1);

require_once 'vendor/autoload.php';

use Dtyq\PhpMcp\Server\McpServer;
use Dtyq\PhpMcp\Shared\Kernel\Application;
use Dtyq\PhpMcp\Server\FastMcp\Tools\RegisteredTool;
use Dtyq\PhpMcp\Server\FastMcp\Resources\RegisteredResource;
use Dtyq\PhpMcp\Types\Tools\Tool;
use Dtyq\PhpMcp\Types\Resources\Resource;
use Dtyq\PhpMcp\Types\Resources\TextResourceContents;

// Simple container implementation
$container = new class implements \Psr\Container\ContainerInterface {
    private array $services = [];

    public function __construct() {
        $this->services[\Psr\Log\LoggerInterface::class] = new class extends \Psr\Log\AbstractLogger {
            public function log($level, $message, array $context = []): void {
                $timestamp = date('Y-m-d H:i:s');
                $contextStr = empty($context) ? '' : ' ' . json_encode($context);
                file_put_contents('server.log', "[{$timestamp}] {$level}: {$message}{$contextStr}\n", FILE_APPEND);
            }
        };

        $this->services[\Psr\EventDispatcher\EventDispatcherInterface::class] =
            new class implements \Psr\EventDispatcher\EventDispatcherInterface {
                public function dispatch(object $event): object { return $event; }
            };
    }

    public function get($id) { return $this->services[$id]; }
    public function has($id): bool { return isset($this->services[$id]); }
};

// Configuration
$config = [
    'sdk_name' => 'complete-stdio-server',
    'transports' => [
        'stdio' => [
            'enabled' => true,
            'buffer_size' => 8192,
            'timeout' => 30,
            'validate_messages' => true,
        ],
    ],
];

// Create tools
function createCalculatorTool(): RegisteredTool {
    $tool = new Tool(
        'calculate',
        [
            'type' => 'object',
            'properties' => [
                'operation' => ['type' => 'string', 'enum' => ['add', 'subtract', 'multiply', 'divide']],
                'a' => ['type' => 'number'],
                'b' => ['type' => 'number'],
            ],
            'required' => ['operation', 'a', 'b'],
        ],
        'Perform mathematical operations'
    );

    return new RegisteredTool($tool, function (array $args): array {
        $a = $args['a'] ?? 0;
        $b = $args['b'] ?? 0;
        $operation = $args['operation'] ?? 'add';

        switch ($operation) {
            case 'add': $result = $a + $b; break;
            case 'subtract': $result = $a - $b; break;
            case 'multiply': $result = $a * $b; break;
            case 'divide':
                if ($b == 0) throw new \Dtyq\PhpMcp\Shared\Exceptions\ValidationError('Division by zero');
                $result = $a / $b;
                break;
            default:
                throw new \Dtyq\PhpMcp\Shared\Exceptions\ValidationError('Unknown operation: ' . $operation);
        }

        return [
            'operation' => $operation,
            'operands' => [$a, $b],
            'result' => $result,
        ];
    });
}

// Create application and server
$app = new Application($container, $config);
$server = new McpServer('complete-stdio-server', '1.0.0', $app);

// Register components
$server
    ->registerTool(createCalculatorTool())
    ->stdio(); // Start STDIO transport
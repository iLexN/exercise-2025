<?php

declare(strict_types=1);
/**
 * Copyright (c) The Magic , Distributed under the software license
 */

namespace Dtyq\PhpMcp\Server\Transports\Core\Handlers;

use Dtyq\PhpMcp\Server\Transports\Core\TransportMetadata;
use Dtyq\PhpMcp\Types\Core\RequestInterface;
use Dtyq\PhpMcp\Types\Core\ResultInterface;
use Dtyq\PhpMcp\Types\Requests\GetPromptRequest;

/**
 * Handler for MCP Get Prompt requests.
 */
class GetPromptMessageHandler extends AbstractMessageHandler
{
    /**
     * @param array<string, mixed> $request
     */
    public function createRequest(array $request): RequestInterface
    {
        return GetPromptRequest::fromArray($request);
    }

    public function handle(RequestInterface $message, TransportMetadata $metadata): ?ResultInterface
    {
        /** @var GetPromptRequest $message */
        $name = $message->getName();
        $arguments = $message->getArguments();
        return $metadata->getPromptManager()->execute($name, $arguments);
    }
}

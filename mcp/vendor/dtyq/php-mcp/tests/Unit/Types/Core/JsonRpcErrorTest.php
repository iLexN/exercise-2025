<?php

declare(strict_types=1);
/**
 * Copyright (c) The Magic , Distributed under the software license
 */

namespace Dtyq\PhpMcp\Tests\Unit\Types\Core;

use Dtyq\PhpMcp\Shared\Exceptions\ErrorData;
use Dtyq\PhpMcp\Types\Core\JsonRpcError;
use Dtyq\PhpMcp\Types\Core\ProtocolConstants;
use InvalidArgumentException;
use Mockery;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 */
class JsonRpcErrorTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testConstructorWithBasicParameters(): void
    {
        $errorData = new ErrorData(-32000, 'Test error', ['detail' => 'test']);
        $error = new JsonRpcError('test-id', $errorData);

        $this->assertEquals('test-id', $error->getId());
        $this->assertEquals($errorData, $error->getError());
        $this->assertEquals(-32000, $error->getCode());
        $this->assertEquals('Test error', $error->getMessage());
        $this->assertEquals(['detail' => 'test'], $error->getData());
    }

    public function testConstructorWithIntegerId(): void
    {
        $errorData = new ErrorData(-32001, 'Auth error');
        $error = new JsonRpcError(12345, $errorData);

        $this->assertEquals(12345, $error->getId());
        $this->assertEquals(-32001, $error->getCode());
        $this->assertEquals('Auth error', $error->getMessage());
    }

    public function testFromArrayWithValidData(): void
    {
        $data = [
            'jsonrpc' => '2.0',
            'id' => 'error-id',
            'error' => [
                'code' => -32602,
                'message' => 'Invalid params',
                'data' => ['param' => 'missing'],
            ],
        ];

        $error = JsonRpcError::fromArray($data);

        $this->assertEquals('error-id', $error->getId());
        $this->assertEquals(-32602, $error->getCode());
        $this->assertEquals('Invalid params', $error->getMessage());
        $this->assertEquals(['param' => 'missing'], $error->getData());
    }

    public function testFromArrayWithoutJsonRpcThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid JSON-RPC version');

        JsonRpcError::fromArray([
            'id' => 'test-id',
            'error' => ['code' => -32000, 'message' => 'Error'],
        ]);
    }

    public function testFromArrayWithInvalidJsonRpcVersionThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid JSON-RPC version');

        JsonRpcError::fromArray([
            'jsonrpc' => '1.0',
            'id' => 'test-id',
            'error' => ['code' => -32000, 'message' => 'Error'],
        ]);
    }

    public function testFromArrayWithoutIdThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('ID is required for error responses');

        JsonRpcError::fromArray([
            'jsonrpc' => '2.0',
            'error' => ['code' => -32000, 'message' => 'Error'],
        ]);
    }

    public function testFromArrayWithoutErrorThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Error is required for error responses');

        JsonRpcError::fromArray([
            'jsonrpc' => '2.0',
            'id' => 'test-id',
        ]);
    }

    public function testFromArrayWithNonArrayErrorThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Error must be an array');

        JsonRpcError::fromArray([
            'jsonrpc' => '2.0',
            'id' => 'test-id',
            'error' => 'string-error',
        ]);
    }

    public function testFromErrorStaticMethod(): void
    {
        $error = JsonRpcError::fromError('static-id', -32003, 'Resource not found', ['uri' => '/test']);

        $this->assertEquals('static-id', $error->getId());
        $this->assertEquals(-32003, $error->getCode());
        $this->assertEquals('Resource not found', $error->getMessage());
        $this->assertEquals(['uri' => '/test'], $error->getData());
    }

    public function testFromErrorWithoutData(): void
    {
        $error = JsonRpcError::fromError('no-data-id', -32601, 'Method not found');

        $this->assertEquals('no-data-id', $error->getId());
        $this->assertEquals(-32601, $error->getCode());
        $this->assertEquals('Method not found', $error->getMessage());
        $this->assertNull($error->getData());
    }

    public function testSetIdWithStringValue(): void
    {
        $errorData = new ErrorData(-32000, 'Test error');
        $error = new JsonRpcError('initial-id', $errorData);

        $error->setId('new-string-id');

        $this->assertEquals('new-string-id', $error->getId());
    }

    public function testSetIdWithIntegerValue(): void
    {
        $errorData = new ErrorData(-32000, 'Test error');
        $error = new JsonRpcError('initial-id', $errorData);

        $error->setId(54321);

        $this->assertEquals(54321, $error->getId());
    }

    public function testSetIdWithInvalidTypeThrowsException(): void
    {
        $errorData = new ErrorData(-32000, 'Test error');
        $error = new JsonRpcError('initial-id', $errorData);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('ID must be string or integer');

        $error->setId(123.45);
    }

    public function testSetError(): void
    {
        $initialError = new ErrorData(-32000, 'Initial error');
        $error = new JsonRpcError('test-id', $initialError);

        $newError = new ErrorData(-32001, 'New error', ['new' => 'data']);
        $error->setError($newError);

        $this->assertEquals($newError, $error->getError());
        $this->assertEquals(-32001, $error->getCode());
        $this->assertEquals('New error', $error->getMessage());
        $this->assertEquals(['new' => 'data'], $error->getData());
    }

    public function testToJsonRpcFormat(): void
    {
        $errorData = new ErrorData(-32602, 'Invalid params', ['required' => 'name']);
        $error = new JsonRpcError('format-id', $errorData);

        $jsonRpc = $error->toJsonRpc();

        $expected = [
            'jsonrpc' => '2.0',
            'id' => 'format-id',
            'error' => [
                'code' => -32602,
                'message' => 'Invalid params',
                'data' => ['required' => 'name'],
            ],
        ];

        $this->assertEquals($expected, $jsonRpc);
    }

    public function testToJsonRpcFormatWithoutData(): void
    {
        $errorData = new ErrorData(-32601, 'Method not found');
        $error = new JsonRpcError('no-data-id', $errorData);

        $jsonRpc = $error->toJsonRpc();

        $expected = [
            'jsonrpc' => '2.0',
            'id' => 'no-data-id',
            'error' => [
                'code' => -32601,
                'message' => 'Method not found',
            ],
        ];

        $this->assertEquals($expected, $jsonRpc);
    }

    public function testToJsonString(): void
    {
        $errorData = new ErrorData(-32000, 'MCP error');
        $error = new JsonRpcError('json-id', $errorData);

        $json = $error->toJson();

        $expected = '{"jsonrpc":"2.0","id":"json-id","error":{"code":-32000,"message":"MCP error"}}';
        $this->assertEquals($expected, $json);
    }

    public function testMatchesRequestWithMatchingId(): void
    {
        $errorData = new ErrorData(-32000, 'Error');
        $error = new JsonRpcError('matching-id', $errorData);

        $this->assertTrue($error->matchesRequest('matching-id'));
    }

    public function testMatchesRequestWithIntegerId(): void
    {
        $errorData = new ErrorData(-32000, 'Error');
        $error = new JsonRpcError(12345, $errorData);

        $this->assertTrue($error->matchesRequest(12345));
    }

    public function testMatchesRequestWithNonMatchingId(): void
    {
        $errorData = new ErrorData(-32000, 'Error');
        $error = new JsonRpcError('error-id', $errorData);

        $this->assertFalse($error->matchesRequest('different-id'));
        $this->assertFalse($error->matchesRequest(12345));
    }

    public function testIsErrorCodeWithMatchingCode(): void
    {
        $errorData = new ErrorData(ProtocolConstants::INVALID_PARAMS, 'Invalid params');
        $error = new JsonRpcError('test-id', $errorData);

        $this->assertTrue($error->isErrorCode(ProtocolConstants::INVALID_PARAMS));
        $this->assertTrue($error->isErrorCode(-32602));
    }

    public function testIsErrorCodeWithNonMatchingCode(): void
    {
        $errorData = new ErrorData(ProtocolConstants::INVALID_PARAMS, 'Invalid params');
        $error = new JsonRpcError('test-id', $errorData);

        $this->assertFalse($error->isErrorCode(ProtocolConstants::METHOD_NOT_FOUND));
        $this->assertFalse($error->isErrorCode(-32000));
        $this->assertFalse($error->isErrorCode(0));
    }

    public function testStandardErrorCodes(): void
    {
        $parseError = JsonRpcError::fromError('test', ProtocolConstants::PARSE_ERROR, 'Parse error');
        $this->assertTrue($parseError->isErrorCode(ProtocolConstants::PARSE_ERROR));

        $invalidRequest = JsonRpcError::fromError('test', ProtocolConstants::INVALID_REQUEST, 'Invalid request');
        $this->assertTrue($invalidRequest->isErrorCode(ProtocolConstants::INVALID_REQUEST));

        $methodNotFound = JsonRpcError::fromError('test', ProtocolConstants::METHOD_NOT_FOUND, 'Method not found');
        $this->assertTrue($methodNotFound->isErrorCode(ProtocolConstants::METHOD_NOT_FOUND));
    }

    public function testMcpSpecificErrorCodes(): void
    {
        $mcpError = JsonRpcError::fromError('test', ProtocolConstants::MCP_ERROR, 'MCP error');
        $this->assertTrue($mcpError->isErrorCode(ProtocolConstants::MCP_ERROR));

        $authError = JsonRpcError::fromError('test', ProtocolConstants::AUTHENTICATION_ERROR, 'Auth error');
        $this->assertTrue($authError->isErrorCode(ProtocolConstants::AUTHENTICATION_ERROR));

        $resourceError = JsonRpcError::fromError('test', ProtocolConstants::RESOURCE_NOT_FOUND, 'Resource not found');
        $this->assertTrue($resourceError->isErrorCode(ProtocolConstants::RESOURCE_NOT_FOUND));
    }

    public function testComplexErrorData(): void
    {
        $complexData = [
            'details' => [
                'field' => 'email',
                'constraints' => ['format', 'required'],
            ],
            'suggestions' => ['Use valid email format'],
            'code' => 'VALIDATION_FAILED',
        ];

        $errorData = new ErrorData(ProtocolConstants::VALIDATION_ERROR, 'Validation failed', $complexData);
        $error = new JsonRpcError('complex-id', $errorData);

        $this->assertEquals($complexData, $error->getData());

        $jsonRpc = $error->toJsonRpc();
        $this->assertEquals($complexData, $jsonRpc['error']['data']);
    }
}

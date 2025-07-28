<?php

declare(strict_types=1);
/**
 * Copyright (c) The Magic , Distributed under the software license
 */

namespace Dtyq\PhpMcp\Tests\Unit\Client\Transport\Http;

use Dtyq\PhpMcp\Client\Configuration\HttpConfig;
use Dtyq\PhpMcp\Client\Transport\Http\HttpAuthenticator;
use Dtyq\PhpMcp\Shared\Exceptions\TransportError;
use Dtyq\PhpMcp\Shared\Exceptions\ValidationError;
use Dtyq\PhpMcp\Shared\Kernel\Logger\LoggerProxy;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionProperty;

/**
 * Unit tests for HttpAuthenticator class.
 * @internal
 */
class HttpAuthenticatorTest extends TestCase
{
    private HttpAuthenticator $authenticator;

    private HttpConfig $config;

    private LoggerProxy $logger;

    protected function setUp(): void
    {
        $this->config = new HttpConfig('https://example.com');
        $this->logger = new LoggerProxy('test-sdk');
        $this->authenticator = new HttpAuthenticator($this->config, $this->logger);
    }

    public function testAddAuthHeadersWithNoAuth(): void
    {
        $headers = ['Content-Type' => 'application/json'];
        $result = $this->authenticator->addAuthHeaders($headers);

        $this->assertEquals($headers, $result);
    }

    public function testAddBearerAuth(): void
    {
        $authConfig = ['type' => 'bearer', 'token' => 'test-token-123'];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $headers = ['Content-Type' => 'application/json'];
        $result = $authenticator->addAuthHeaders($headers);

        $this->assertArrayHasKey('Authorization', $result);
        $this->assertEquals('Bearer test-token-123', $result['Authorization']);
        $this->assertEquals('application/json', $result['Content-Type']);
    }

    public function testAddBearerAuthMissingToken(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.token\': is required for bearer authentication');

        $authConfig = ['type' => 'bearer'];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddBearerAuthInvalidToken(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.token\': is required for bearer authentication');

        $authConfig = ['type' => 'bearer', 'token' => 123];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddBasicAuth(): void
    {
        $authConfig = ['type' => 'basic', 'username' => 'user', 'password' => 'pass'];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $headers = ['Content-Type' => 'application/json'];
        $result = $authenticator->addAuthHeaders($headers);

        $expectedCredentials = base64_encode('user:pass');
        $this->assertArrayHasKey('Authorization', $result);
        $this->assertEquals('Basic ' . $expectedCredentials, $result['Authorization']);
    }

    public function testAddBasicAuthMissingUsername(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.username\': is required for basic authentication');

        $authConfig = ['type' => 'basic', 'password' => 'pass'];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddBasicAuthMissingPassword(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.password\': is required for basic authentication');

        $authConfig = ['type' => 'basic', 'username' => 'user'];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddBasicAuthInvalidCredentials(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.username\': is required for basic authentication');

        $authConfig = ['type' => 'basic', 'username' => 123, 'password' => 'pass'];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddCustomAuth(): void
    {
        $customHeaders = ['X-API-Key' => 'secret-key', 'X-Client-ID' => 'client-123'];
        $authConfig = ['type' => 'custom', 'headers' => $customHeaders];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $headers = ['Content-Type' => 'application/json'];
        $result = $authenticator->addAuthHeaders($headers);

        $this->assertEquals('application/json', $result['Content-Type']);
        $this->assertEquals('secret-key', $result['X-API-Key']);
        $this->assertEquals('client-123', $result['X-Client-ID']);
    }

    public function testAddCustomAuthMissingHeaders(): void
    {
        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('Invalid value for field \'auth.headers\': is required for custom authentication');

        $authConfig = ['type' => 'custom'];
        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testAddCustomAuthInvalidHeaders(): void
    {
        $this->expectException(TransportError::class);
        $this->expectExceptionMessage('Custom headers must be string key-value pairs');

        $authConfig = ['type' => 'custom', 'headers' => ['key' => 123]];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $authenticator->addAuthHeaders([]);
    }

    public function testOAuth2WithAccessToken(): void
    {
        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
            'access_token' => 'oauth-token-123',
        ];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $headers = ['Content-Type' => 'application/json'];
        $result = $authenticator->addAuthHeaders($headers);

        $this->assertArrayHasKey('Authorization', $result);
        $this->assertEquals('Bearer oauth-token-123', $result['Authorization']);
    }

    public function testOAuth2WithoutAccessToken(): void
    {
        $this->expectException(TransportError::class);
        $this->expectExceptionMessage('Failed to obtain OAuth2 access token');

        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
        ];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $authenticator->addAuthHeaders([]);
    }

    public function testOAuth2Caching(): void
    {
        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
            'access_token' => 'oauth-token-123',
            'expires_in' => 3600,
        ];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        // First call should cache the token
        $headers1 = $authenticator->addAuthHeaders([]);
        $this->assertEquals('Bearer oauth-token-123', $headers1['Authorization']);

        // Second call should use cached token
        $headers2 = $authenticator->addAuthHeaders([]);
        $this->assertEquals('Bearer oauth-token-123', $headers2['Authorization']);

        // Check auth status
        $status = $authenticator->getAuthStatus();
        $this->assertTrue($status['has_cache']);
        $this->assertTrue($status['cache_valid']);
    }

    public function testUnknownAuthType(): void
    {
        // Skip validation by creating config without auth, then manually setting it
        $config = new HttpConfig('https://example.com');
        $reflectionProperty = new ReflectionProperty(HttpConfig::class, 'auth');
        $reflectionProperty->setAccessible(true);
        $reflectionProperty->setValue($config, ['type' => 'unknown']);

        $this->expectException(TransportError::class);
        $this->expectExceptionMessage('Unsupported authentication type: unknown');

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $authenticator->addAuthHeaders(['Content-Type' => 'application/json']);
    }

    public function testGetAuthStatus(): void
    {
        $authConfig = ['type' => 'bearer', 'token' => 'test-token'];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        $status = $authenticator->getAuthStatus();

        $this->assertTrue($status['has_auth']);
        $this->assertEquals('bearer', $status['auth_type']);
        $this->assertFalse($status['has_cache']);
        $this->assertFalse($status['cache_valid']);
        $this->assertEquals(0, $status['cache_expires_at']);
        $this->assertEquals(3600, $status['cache_ttl']);
    }

    public function testGetAuthStatusNoAuth(): void
    {
        $status = $this->authenticator->getAuthStatus();

        $this->assertFalse($status['has_auth']);
        $this->assertNull($status['auth_type']);
        $this->assertFalse($status['has_cache']);
        $this->assertFalse($status['cache_valid']);
    }

    public function testSetCacheTtl(): void
    {
        $this->authenticator->setCacheTtl(7200);
        $this->assertEquals(7200, $this->authenticator->getCacheTtl());

        $status = $this->authenticator->getAuthStatus();
        $this->assertEquals(7200, $status['cache_ttl']);
    }

    public function testSetCacheTtlNegative(): void
    {
        $this->expectException(TransportError::class);
        $this->expectExceptionMessage('Cache TTL cannot be negative');

        $this->authenticator->setCacheTtl(-1);
    }

    public function testRefreshAuth(): void
    {
        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
            'access_token' => 'oauth-token-123',
        ];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        // First call should cache the token
        $headers1 = $authenticator->addAuthHeaders([]);
        $this->assertEquals('Bearer oauth-token-123', $headers1['Authorization']);

        // Refresh should clear cache
        $authenticator->refreshAuth();
        $status = $authenticator->getAuthStatus();
        $this->assertFalse($status['has_cache']);
    }

    public function testCacheExpiration(): void
    {
        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
            'access_token' => 'oauth-token-123',
            'expires_in' => 3600,
        ];
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
        $authenticator = new HttpAuthenticator($config, $this->logger);

        // Add token to cache
        $authenticator->addAuthHeaders([]);
        $status = $authenticator->getAuthStatus();
        $this->assertTrue($status['cache_valid']);

        // Force refresh to simulate expiration
        $authenticator->refreshAuth();

        // Cache should be invalid now after refresh
        $status = $authenticator->getAuthStatus();
        $this->assertFalse($status['cache_valid']);
        $this->assertFalse($status['has_cache']);
    }

    public function testBasicAuth(): void
    {
        $authConfig = [
            'type' => 'basic',
            'username' => 'user',
            'password' => 'pass',
        ];

        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $headers = $authenticator->addAuthHeaders([]);

        $expectedCredentials = base64_encode('user:pass');
        $this->assertArrayHasKey('Authorization', $headers);
        $this->assertEquals('Basic ' . $expectedCredentials, $headers['Authorization']);
    }

    public function testInvalidAuthType(): void
    {
        $authConfig = ['type' => 'invalid'];

        $this->expectException(ValidationError::class);
        $this->expectExceptionMessage('must be one of: bearer, basic, oauth2, custom');

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testMissingBasicCredentials(): void
    {
        $authConfig = ['type' => 'basic'];

        $this->expectException(ValidationError::class);

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testBearerAuth(): void
    {
        $authConfig = [
            'type' => 'bearer',
            'token' => 'my-token',
        ];

        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $headers = $authenticator->addAuthHeaders([]);

        $this->assertArrayHasKey('Authorization', $headers);
        $this->assertEquals('Bearer my-token', $headers['Authorization']);
    }

    public function testMissingBearerToken(): void
    {
        $authConfig = ['type' => 'bearer'];

        $this->expectException(ValidationError::class);

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testEmptyBearerToken(): void
    {
        $authConfig = ['type' => 'bearer', 'token' => ''];

        $this->expectException(ValidationError::class);

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testEmptyBasicUsername(): void
    {
        $authConfig = ['type' => 'basic', 'username' => '', 'password' => 'pass'];

        $this->expectException(ValidationError::class);

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testCustomHeaders(): void
    {
        $authConfig = [
            'type' => 'bearer',
            'token' => 'my-token',
        ];

        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $existingHeaders = ['X-Custom' => 'value'];
        $headers = $authenticator->addAuthHeaders($existingHeaders);

        $this->assertArrayHasKey('Authorization', $headers);
        $this->assertArrayHasKey('X-Custom', $headers);
        $this->assertEquals('Bearer my-token', $headers['Authorization']);
        $this->assertEquals('value', $headers['X-Custom']);
    }

    public function testMissingBasicPassword(): void
    {
        $authConfig = ['type' => 'basic', 'username' => 'user'];

        $this->expectException(ValidationError::class);

        new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );
    }

    public function testOAuth2WithClientCredentials(): void
    {
        $authConfig = [
            'type' => 'oauth2',
            'client_id' => 'client-123',
            'client_secret' => 'secret',
            'access_token' => 'oauth-token-123',
        ];

        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            $authConfig                   // auth
        );

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $headers = $authenticator->addAuthHeaders([]);

        $this->assertArrayHasKey('Authorization', $headers);
        $this->assertEquals('Bearer oauth-token-123', $headers['Authorization']);
    }

    public function testNullAuth(): void
    {
        $config = new HttpConfig(
            'https://example.com',        // baseUrl
            15.0, // timeout
            300.0,                        // sseTimeout
            3,                            // maxRetries
            1.0,                          // retryDelay
            true,                         // validateSsl
            'test-agent',                 // userAgent
            [],                           // headers
            null                          // auth
        );

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $headers = $authenticator->addAuthHeaders(['X-Test' => 'value']);

        // Should not add Authorization header for null auth
        $this->assertArrayNotHasKey('Authorization', $headers);
        $this->assertEquals(['X-Test' => 'value'], $headers);
    }

    public function testUnsupportedAuthType(): void
    {
        // Manually set auth to bypass validation in HttpConfig constructor
        $config = new HttpConfig('https://example.com');

        $reflection = new ReflectionClass($config);
        $authProperty = $reflection->getProperty('auth');
        $authProperty->setAccessible(true);
        $authProperty->setValue($config, ['type' => 'unsupported']);

        $this->expectException(TransportError::class);
        $this->expectExceptionMessage('Unsupported authentication type: unsupported');

        $authenticator = new HttpAuthenticator($config, $this->logger);
        $authenticator->addAuthHeaders([]);
    }
}

/**
 * Global test setup
 * This file runs before all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

# Test Infrastructure Documentation

## Overview
The core test infrastructure has been successfully set up for the Student Management System backend. This infrastructure provides all necessary utilities for writing comprehensive API tests.

## Files Created

### 1. `src/tests/helpers.ts`
**Purpose**: Core utilities for all test suites

**Features**:
- **`createTestApp()`**: Creates an Express app instance for testing
- **`loginAsAdmin(app)`**: Returns admin authentication token
- **`loginAsTeacher(app, teacherNumber)`**: Returns teacher authentication token
- **Database Helpers**: Functions to get seeded data IDs:
  - `getFirstAcademicYearId()`
  - `getFirstGradeId()`
  - `getFirstSubjectId()`
  - `getFirstStudentId()`
  - `getFirstParentId()`
  - `getFirstClassId()`
  - `getFirstTeacherId()`
- **`cleanupTestData(createdIds)`**: Optional cleanup for test data
- **`disconnectPrisma()`**: Close database connections (use in `afterAll`)
- **`prisma`**: Exported Prisma client instance for direct database access

### 2. `src/tests/setup.ts`
**Purpose**: Global test configuration

**Features**:
- Sets `NODE_ENV=test`
- Configures Jest timeout to 10 seconds for database operations

### 3. `src/tests/infrastructure.test.ts`
**Purpose**: Verification test for the infrastructure

**Features**:
- Verifies Express app creation
- Tests authentication helpers
- Validates protected route access with tokens

## Configuration Files Updated

### `jest.config.js`
- Added `setupFilesAfterEnv` to load global setup
- Configured TypeScript support via `ts-jest`
- Set test pattern to match `**/tests/**/*.test.ts`

### `package.json`
- Added `"test": "jest"` script

## Usage Example

```typescript
import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma } from './helpers';
import { Express } from 'express';

describe('My API Tests', () => {
  let app: Express;
  let token: string;

  beforeAll(async () => {
    app = createTestApp();
    token = await loginAsAdmin(app);
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('should access protected endpoint', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});
```

## Prerequisites

Before running tests:
1. Ensure the database is running and accessible at the URL specified in `.env`
2. Run `npm run seed` to populate the database with test data
3. The tests rely on seeded data (admin user, teachers, students, etc.)

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- infrastructure.test.ts

# Run tests with coverage
npm test -- --coverage
```

## Next Steps

The infrastructure is ready for implementing test suites for all 9 modules:
1. Authentication (2 endpoints)
2. User Management (5 endpoints)
3. Student Management (5 endpoints)
4. Parent Management (5 endpoints)
5. Academic Year Management (6 endpoints)
6. Grade Management (5 endpoints)
7. Subject Management (5 endpoints)
8. Class Management (8 endpoints)
9. Score Management (6 endpoints)

**Total: 47 endpoints to test**

# Testing Guidelines

## Overview
This document outlines the testing strategy and best practices for the BuildWise platform.

## Test Structure

### Unit Tests
- **Location**: Colocated with source files (`*.test.ts` or `*.test.tsx`)
- **Purpose**: Test individual functions, components, and utilities in isolation
- **Coverage Target**: 50% minimum

### Integration Tests
- **Location**: `src/app/api/api.test.ts`
- **Purpose**: Test API routes and database interactions
- **Mocking**: Use mocked Supabase client

### E2E Tests (Future)
- **Tool**: Playwright
- **Purpose**: Test critical user flows end-to-end

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Hero.test.tsx
```

## Writing Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyComponent from './MyComponent'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}))

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />)
        expect(screen.getByText('Hello')).toBeInTheDocument()
    })
})
```

### API Route Tests
```typescript
/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

// Mock Supabase
jest.mock('@/lib/supabase-server', () => ({
    createClient: jest.fn(() => ({
        // Mock implementation
    }))
}))

describe('API Route', () => {
    it('handles requests', async () => {
        // Test implementation
    })
})
```

## Coverage Requirements

- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

## CI/CD Integration

Tests run automatically on:
- Every push to main/master
- Every pull request

Quality gates:
- ✅ Linting must pass
- ✅ Type checking must pass
- ✅ All tests must pass
- ✅ Build must succeed

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Mock external dependencies**
4. **Keep tests focused and simple**
5. **Avoid testing implementation details**
6. **Test edge cases and error conditions**

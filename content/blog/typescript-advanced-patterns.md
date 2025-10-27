---
title: "Advanced TypeScript Patterns for Better Code"
excerpt: "Level up your TypeScript skills with advanced patterns, generics, and type-safe techniques for professional development."
author: "Sarah Chen"
publishedAt: "2024-01-10"
tags: ["TypeScript", "JavaScript", "Programming", "Type Safety"]
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop"
readingTime: 10
---

# Advanced TypeScript Patterns for Better Code

TypeScript offers powerful features that go beyond basic type annotations. Master these advanced patterns to write more maintainable, type-safe code.

## Generic Types and Constraints

### Understanding Generics

Generics allow you to write flexible, reusable functions and classes:

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic with constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

### Advanced Generic Patterns

#### Conditional Types

Create types that depend on other types:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type SuccessResponse<T> = ApiResponse<T> & {
  status: 200;
};

type ErrorResponse = ApiResponse<never> & {
  status: Exclude<number, 200>;
};
```

#### Mapped Types

Transform existing types into new ones:

```typescript
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Stringify<T> = {
  [K in keyof T]: string;
};

// Example usage
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Optional<User, 'email'>;
type UserStrings = Stringify<User>;
```

## Utility Types and Patterns

### Branded Types

Create distinct types that prevent accidental misuse:

```typescript
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createUser(email: string): { id: UserId; email: Email } {
  return {
    id: createUserId(crypto.randomUUID()),
    email: email as Email
  };
}

// Type-safe email validation
function isValidEmail(email: string): email is Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### State Machine Types

Model complex state transitions with type safety:

```typescript
type State = 'idle' | 'loading' | 'success' | 'error';

type StateMachine<TState, TEvent> = {
  initialState: TState;
  transitions: {
    [K in TState]: {
      [E in TEvent]?: TState | ((payload?: any) => TState);
    };
  };
};

// Usage example
type UserState = State;
type UserEvent = 'FETCH' | 'SUCCESS' | 'ERROR' | 'RESET';

const userStateMachine: StateMachine<UserState, UserEvent> = {
  initialState: 'idle',
  transitions: {
    idle: {
      FETCH: 'loading'
    },
    loading: {
      SUCCESS: 'success',
      ERROR: 'error'
    },
    success: {
      FETCH: 'loading',
      RESET: 'idle'
    },
    error: {
      FETCH: 'loading',
      RESET: 'idle'
    }
  }
};
```

## Function Types and Higher-Order Functions

### Function Composition

Create type-safe function composition utilities:

```typescript
type FunctionType = (...args: any[]) => any;

type Compose<F extends FunctionType, G extends FunctionType> =
  (...args: Parameters<F>) => ReturnType<G>;

function compose<F extends FunctionType, G extends FunctionType>(
  f: F,
  g: G
): Compose<F, G> {
  return (...args: Parameters<F>) => g(f(...args));
}

// Example usage
const add = (a: number, b: number) => a + b;
const multiply = (x: number) => x * 2;

const addAndDouble = compose(add, multiply);
console.log(addAndDouble(3, 5)); // 16
```

### Curry Functions

Create type-safe curried functions:

```typescript
type Curry<T> = T extends (...args: infer A) => infer R
  ? A extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<(...args: Rest) => R>
    : T
  : never;

function curry<T>(fn: T): Curry<T> {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}

// Usage
const add3 = (a: number, b: number, c: number) => a + b + c;
const curriedAdd3 = curry(add3);
console.log(curriedAdd3(1)(2)(3)); // 6
```

## Advanced Type Manipulation

### Template Literal Types

Use TypeScript's template literal types for powerful string manipulation:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ButtonEvents = {
  [K in EventName<'click' | 'hover' | 'focus'>]: (event: any) => void;
};

// Resulting type:
// {
//   onClick: (event: any) => void;
//   onHover: (event: any) => void;
//   onFocus: (event: any) => void;
// }
```

### Recursive Types

Define recursive types for complex data structures:

```typescript
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type NestedObject<T> = {
  [K in keyof T]: T[K] extends object ? NestedObject<T[K]> : T[K];
};
```

## Performance Considerations

### Type Inference Optimization

Help TypeScript with type inference:

```typescript
// Bad: Complex inference
const getUsers = (filter: { active?: boolean; role?: string }) => {
  // Implementation
};

// Good: Explicit generics
const getUsers = <T extends { active?: boolean; role?: string }>(filter: T) => {
  // Implementation
};
```

### Conditional Type Performance

Avoid deeply nested conditional types that can slow compilation:

```typescript
// Avoid overly complex conditions
type ComplexType<T> = T extends string
  ? T extends `${infer Prefix}_${infer Suffix}`
    ? { prefix: Prefix; suffix: Suffix }
    : never
  : never;

// Prefer simpler, composable types
type StringParts<T extends string> =
  T extends `${infer Prefix}_${infer Suffix}`
    ? { prefix: Prefix; suffix: Suffix }
    : never;
```

## Best Practices Summary

1. **Use Generics Wisely**: Create reusable, type-safe components
2. **Leverage Utility Types**: Use built-in utility types and create custom ones
3. **Prefer Composition**: Build complex types from simpler ones
4. **Maintain Performance**: Avoid overly complex type computations
5. **Type-Safe APIs**: Create APIs that prevent runtime errors at compile time

Mastering these advanced TypeScript patterns will significantly improve your code quality and developer experience. Start with simple patterns and gradually incorporate more complex ones as you become comfortable.

---

*What TypeScript patterns do you use in your projects? Share your favorite techniques!*
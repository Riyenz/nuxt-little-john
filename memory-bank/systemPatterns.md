# System Patterns

## API Structure

### Task Management

- RESTful endpoints in `/api/tasks` folder:
  - GET `/api/tasks` - List authenticated user's tasks
  - POST `/api/tasks` - Create new task for authenticated user
  - PATCH `/api/tasks/[id]` - Update authenticated user's task
  - DELETE `/api/tasks/[id]` - Delete authenticated user's task

### Authentication & Security

- Firebase authentication for user management
- Auth middleware for API endpoint protection
- User session management with auto-logout
- Token refresh handling in useApi composable
- User-specific data filtering by createdBy email
- Automatic task refresh on user changes
- Task clearing on user logout

## Data Models

### Task Model

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User's email for data filtering
}
```

## State Management

- Pinia store for task management
- User state watching for data refresh
- Optimistic updates for better UX
- Centralized error handling
- Toast notifications for user feedback

## Component Architecture

- Reusable UI components
- Form validation with Zod
- Composables for shared logic
- Lazy loading for better performance

## Security Patterns

- Firebase Admin SDK for backend authentication
- User-specific data filtering
- API endpoint protection
- Session management with inactivity detection
- Token refresh on each API call
- User state management for data access

## Error Handling

- Consistent error response format
- Type-safe error handling
- Toast notifications for user feedback
- Graceful fallbacks for failed operations

## Code Organization

- Feature-based directory structure
- Clear separation of concerns
- Type safety across components
- Centralized API handling with useApi composable
- User-specific state management

## Architecture Overview

1. Frontend Framework

   - Nuxt 3 as the core framework
   - Nuxt UI for component library
   - Vue 3 Composition API
   - Pinia for state management

2. State Management
   - Pinia stores for global state
   - Task management store
   - Authentication state with Firebase
   - User preferences persistence

## Key Technical Decisions

1. Authentication

   - Firebase Google OAuth implementation
   - Token management with Firebase Auth
   - Protected route middleware
   - User session persistence

2. Data Management

   - Pinia stores for data handling
   - Computed properties for derived state
   - Reactive state management
   - Type-safe store implementations

3. Component Architecture
   - Modular component design
   - Form components with validation
   - Table components with filters
   - Modal components for actions

## Design Patterns

1. CRUD Operations

   - Zod schema validation
   - Data table with sorting and filtering
   - Task creation modal
   - Type-safe operations

2. UI Patterns

   - Responsive layout design
   - Component-based modals
   - Form validation feedback
   - Table filtering and pagination

3. Data Organization
   - Sorted task display
   - Filter implementations
   - Search functionality
   - Status categorization

## Component Relationships

1. Layout Components

   - Default layout with navigation
   - Authenticated layout wrapper
   - Responsive sidebar
   - Dynamic header

2. Feature Components

   - TasksTable with filtering
   - TaskFormModal for creation
   - DashboardCards for metrics
   - WelcomeMessage with time

3. Utility Components
   - UTable with extensions
   - UModal for forms
   - UBadge for status
   - USelect for filtering

## Type System

1. Core Types

   - Task interface
   - User interface
   - Store state types
   - Form schema types

2. Component Props

   - Table column definitions
   - Modal props
   - Form field props
   - Badge variants

3. Store Types
   - Task store state
   - Task mutations
   - Computed properties
   - Action parameters

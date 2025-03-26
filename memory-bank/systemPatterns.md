# System Patterns

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

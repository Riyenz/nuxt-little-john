# Little John - Task Management System

A modern task management system built with Nuxt 3 and Nuxt UI, featuring Google authentication, real-time task tracking, and a responsive dashboard.

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com)
- **Authentication**: Firebase Authentication with Google OAuth
- **State Management**: [Pinia](https://pinia.vuejs.org)
- **Form Validation**: [Zod](https://zod.dev)
- **Package Manager**: [pnpm](https://pnpm.io)

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Firebase project with Google Authentication enabled

## Project Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd nuxt-little-john
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nuxt-little-john/
├── app/
│   ├── components/        # Reusable Vue components
│   ├── composables/       # Shared composable functions
│   ├── layouts/          # Page layouts
│   ├── middleware/       # Route middleware
│   ├── pages/           # Application pages/routes
│   ├── stores/          # Pinia stores
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── memory-bank/         # Project documentation
```

## Key Features

- **Authentication**

  - Google OAuth login/logout
  - Protected routes
  - User session management

- **Task Management**

  - Create, read, update, delete tasks
  - Task filtering and sorting
  - Task status tracking
  - Due date management

- **Dashboard**
  - Real-time task statistics
  - Dynamic status cards
  - Task overview table

## Development Guidelines

### Code Style

- Follow Vue 3 Composition API conventions
- Use TypeScript for type safety
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Keep components small and focused
- Use Nuxt UI components when possible

### State Management

- Use Pinia stores for global state
- Keep store modules focused and well-documented
- Use computed properties for derived state
- Implement proper error handling

### Component Structure

- Use TypeScript for props and emits
- Implement proper form validation using Zod
- Follow the single-responsibility principle
- Use composables for reusable logic

### Git Workflow

1. Create a new branch for each feature/fix:

```bash
git checkout -b feature/feature-name
```

2. Make commits following conventional commits:

```bash
git commit -m "feat(scope): description"
git commit -m "fix(scope): description"
```

3. Push changes and create a pull request:

```bash
git push origin feature/feature-name
```

## Available Commands

```bash
# Development
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm preview       # Preview production build

# Linting
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors

# Type Checking
pnpm typecheck    # Run TypeScript type checking
```

## Production Deployment

1. Build the application:

```bash
pnpm build
```

2. Preview the production build locally:

```bash
pnpm preview
```

3. Deploy to your hosting platform of choice (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[MIT License](LICENSE)

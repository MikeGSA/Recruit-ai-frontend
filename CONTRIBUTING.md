# Contributing to Recruit-AI Frontend

Thank you for your interest in contributing to Recruit-AI! This guide will help you get started.

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic understanding of React and TypeScript

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/MikeGSA/Recruit-ai-frontend.git
cd recruit-ai-frontend

# Install dependencies
npm install

# Create .env.local with your configuration
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your changes live.

## Development Workflow

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/your-bug-name
```

### 2. Make Changes

Follow these conventions:
- **One feature per branch**
- **Meaningful commit messages**
- **Keep commits atomic and logical**

### 3. Code Style

This project enforces consistent code style:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

#### Naming Conventions
- **Components**: PascalCase (`UserCard.tsx`)
- **Utilities**: camelCase (`formatDate()`)
- **Types**: PascalCase (`UserProfile`)
- **Files**: kebab-case or PascalCase matching exports

#### TypeScript Guidelines
- Always define prop types as interfaces
- Avoid `any` type
- Use strict null checks
- Export types from `src/types/index.ts`

#### React Best Practices
- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for shared logic
- Memoize expensive operations

### 4. Commit Guidelines

```bash
# Format: type(scope): subject
# Example:
# feat(store): add filter by status method
# fix(navbar): close dropdown on click
# docs(readme): update installation steps
# style(globals): improve button styling
# refactor(pages): simplify candidate detail
# test(components): add badge tests
```

#### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependencies, etc.

### 5. Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

When adding new features:
- Write tests alongside your code
- Aim for >80% coverage on new code
- Test edge cases and error states

## Pull Request Process

### Before Submitting

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks locally**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Update documentation** if needed
   - Update README.md if adding major features
   - Add comments for complex logic
   - Update type definitions

### Creating a Pull Request

1. **Clear title and description**
   ```
   Title: Add candidate filtering by status
   
   Description:
   - Adds getCandidatesByStatus() to store
   - Updates Dashboard to use new filter
   - Improves performance by reducing re-renders
   
   Closes #123
   ```

2. **Include screenshots** for UI changes

3. **Link related issues** using `Closes #123`

### Review Guidelines

- Be open to feedback
- Respond to all comments
- Request re-review after making changes
- Be respectful and constructive

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/`
2. Use `Layout` component for consistency
3. Import and use hooks from store
4. Add TypeScript types

```tsx
// src/pages/mypage.tsx
import Layout from '@/components/Layout';
import { useRecruitStore } from '@/lib/store';

export default function MyPage() {
  const { roles } = useRecruitStore();
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Your content */}
      </div>
    </Layout>
  );
}
```

### Adding a New Component

```tsx
// src/components/MyComponent.tsx
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
}

export default function MyComponent({ 
  title, 
  children, 
  isLoading = false 
}: Props) {
  return (
    <div className="card p-5">
      <h1 className="font-semibold">{title}</h1>
      {isLoading ? <p>Loading...</p> : children}
    </div>
  );
}
```

### Adding Utility Functions

```typescript
// src/lib/utils.ts
/**
 * Formats a phone number (adds documentation)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}
```

### Adding New Types

```typescript
// src/types/index.ts
export interface MyNewType {
  id: string;
  name: string;
  email: string;
  // ... other properties
}
```

### Adding Store Methods

```typescript
// src/lib/store.ts
export const useRecruitStore = create<RecruitStore>()(
  persist(
    (set, get) => ({
      // ... existing methods
      
      myNewMethod: () => {
        // Implementation
      },
    }),
    // ... persist config
  )
);
```

## Important Files & Patterns

### Using the Store
```typescript
import { useRecruitStore } from '@/lib/store';

const { roles, getAllCandidates } = useRecruitStore();
```

### Using Utilities
```typescript
import { formatDate, getStatusColor } from '@/lib/utils';

const formatted = formatDate(dateString);
const color = getStatusColor(status);
```

### API Calls
```typescript
import { runPipeline } from '@/lib/n8n';

try {
  const result = await runPipeline({
    resume_text: text,
    job_description: desc,
    job_id: id,
  });
} catch (error) {
  // Handle error
}
```

## Debugging

### Enable Debug Logging
```tsx
// Add to your component
useEffect(() => {
  console.log('State updated:', useRecruitStore.getState());
}, []);
```

### DevTools
- Use React DevTools browser extension
- Use Redux DevTools for Zustand
- Use Next.js debug tools

### Build Issues
```bash
# Clear cache
rm -rf .next node_modules
npm install

# Rebuild
npm run build
```

## Performance Tips

- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Use `React.memo` for expensive components
- Lazy load pages when possible
- Optimize images and assets

## Documentation

When adding new features:
- **JSDoc comments** for functions
- **Inline comments** for complex logic
- **README updates** for major features
- **Type documentation** in interfaces

Example:
```typescript
/**
 * Calculates average fit score for candidates
 * @param candidates - Array of screening results
 * @returns Average score rounded to nearest integer
 */
export function getAverageFitScore(candidates: ScreeningResult[]): number {
  if (candidates.length === 0) return 0;
  const sum = candidates.reduce((acc, c) => acc + c.fit_score, 0);
  return Math.round(sum / candidates.length);
}
```

## Getting Help

- **Questions**: Open a discussion in GitHub Discussions
- **Bugs**: Open an issue with detailed steps to reproduce
- **Ideas**: Create a feature request issue
- **Chat**: Reach out to the team on Slack

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Happy coding!** 🎉

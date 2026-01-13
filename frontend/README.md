# Admin CRUD Frontend

A production-ready Next.js 14 admin panel with TypeScript, Tailwind CSS, and comprehensive state management for CRUD operations.

## Features

### ✅ Authentication
- User registration and login
- Protected routes with middleware
- JWT token management
- Automatic token refresh
- Session persistence

### ✅ User Management
- View all users with pagination
- Search and filter users
- Create, edit, delete users
- Assign roles (Admin, Moderator, Viewer)
- Bulk operations
- User activation/deactivation

### ✅ Content Management
- Create and manage articles
- Draft/publish/archive states
- Category management
- Rich text editor support
- Audit logs visualization

### ✅ Dashboard
- Statistics cards
- Recent activities
- Quick action buttons
- Chart integration (Recharts)

### ✅ UI/UX
- Responsive design
- Dark/light mode support
- Form validation with Zod
- Toast notifications
- Loading states
- Error boundaries

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

## Development

### Running Tests
```bash
npm test
npm test:watch
npm test:cov
```

### Code Quality
```bash
npm run lint
npm run lint:fix
npm run format
npm run type-check
```

### Build for Production
```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all available options:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Admin CRUD System
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── (auth)/              # Auth route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/         # Dashboard route group
│       ├── dashboard/page.tsx
│       ├── admin/
│       │   ├── users/page.tsx
│       │   └── content/
│       └── layout.tsx
├── components/              # React components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── Button.tsx
│   ├── Table.tsx
│   ├── ProtectedRoute.tsx
│   └── AuthInitializer.tsx
├── services/                # API services
│   ├── api.ts              # Axios client
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── content.service.ts
├── store/                   # Zustand stores
│   ├── auth.store.ts
│   └── theme.store.ts
├── hooks/                   # Custom hooks
├── types/                   # TypeScript types
└── lib/                     # Utilities
```

## Components

### Navbar
- Logo and navigation
- Theme toggle
- User menu with profile and logout

### Sidebar
- Navigation menu
- Role-based visibility
- Active route highlighting

### Button
- Multiple variants (primary, secondary, danger)
- Multiple sizes (sm, md, lg)
- Disabled state

### Table
- Sortable columns
- Pagination
- Row click handlers
- Loading state

### ProtectedRoute
- Route access control
- Role-based authorization
- Redirect to login if unauthorized

## State Management

### Auth Store (Zustand)
```typescript
useAuthStore()
- user: UserData | null
- isAuthenticated: boolean
- isLoading: boolean
- error: string | null
- login(email, password)
- register(email, firstName, lastName, password)
- logout()
- loadUser()
- clearError()
```

### Theme Store (Zustand)
```typescript
useThemeStore()
- theme: 'light' | 'dark'
- setTheme(theme)
- toggleTheme()
```

## API Integration

### Axios Client
- Automatic JWT token injection
- Request/response interceptors
- Automatic token refresh on 401
- Logout on invalid tokens

### Services
- `authService` - Authentication operations
- `userService` - User management
- `contentService` - Content operations

## Forms & Validation

### React Hook Form + Zod
- Client-side validation
- Type-safe form handling
- Server error integration
- Error message display

Example:
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Dark Mode

Implemented with CSS classes:
- `dark` class on root element
- Tailwind dark mode support
- Persistent theme in store
- System preference detection ready

## Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Flexible grid layout
- Touch-friendly interactions

## Performance

- Code splitting with dynamic imports
- Image optimization
- SEO optimization
- React Query caching

## Docker

### Build and Run
```bash
docker build -t crud-admin-frontend .
docker run -p 3001:3000 crud-admin-frontend
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

See [DEPLOYMENT_FRONTEND.md](../docs/DEPLOYMENT_FRONTEND.md) for detailed instructions.

### AWS S3 + CloudFront
Static export with `next export` command.

## Testing Credentials

For testing purposes:
```
Email: test@example.com
Password: password123
```

Register new users through the registration page.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 3001 already in use
```bash
lsof -i :3001
kill -9 <PID>
npm run dev -- -p 3002
```

### API connection errors
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check browser console for CORS errors

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Write tests for new features
4. Keep components small and focused

## License

MIT

## Support

- API Documentation: `http://localhost:3000/api/docs`
- GitHub Issues: Submit issues and feature requests

## Architecture

See [ARCHITECTURE.md](../docs/ARCHITECTURE.md) for detailed architecture information.

## Performance Tips

1. Use React Query for caching
2. Lazy load components
3. Optimize images
4. Enable compression
5. Monitor Core Web Vitals

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance

## SEO

- Meta tags in layout
- Open Graph support
- Structured data ready
- Sitemap generation ready

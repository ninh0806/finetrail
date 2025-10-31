# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Finetrail** is a modern personal finance management web application for tracking expenses, managing wallets, and visualizing spending habits. The application is fully functional with authentication, multi-wallet support, transaction tracking, categories, and budget management.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: TailwindCSS v4 with shadcn/ui components (New York style, 50+ components)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and credentials providers
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **UI Feedback**: Sonner for toast notifications

## Development Commands

```bash
# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Database operations
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed with demo data (creates demo@finetrail.com user)
pnpm db:studio      # Open Prisma Studio GUI
```

## Architecture

### Application Structure

The app uses Next.js App Router with route groups:
- `app/(dashboard)/` - Protected dashboard routes with sidebar layout
- `app/auth/` - Authentication pages (signin, signup)
- `app/actions/` - Server actions for all CRUD operations
- `app/api/auth/` - NextAuth.js API routes

### Server Actions Pattern

All database operations use Next.js server actions (`"use server"`) instead of API routes:
- `app/actions/wallets.ts` - Wallet CRUD operations
- `app/actions/categories.ts` - Category CRUD operations
- `app/actions/transactions.ts` - Transaction CRUD operations
- `app/actions/budgets.ts` - Budget CRUD operations

Each action uses `requireAuth()` from `lib/auth-helpers.ts` for authentication and calls `revalidatePath()` to refresh UI.

### Authentication Flow

- NextAuth.js with JWT strategy (configured in `lib/auth.ts`)
- Two providers: Google OAuth and credentials (email/password with bcryptjs)
- Custom sign-in/sign-up pages at `/auth/signin` and `/auth/signup`
- Session management with `getCurrentUser()` and `requireAuth()` helpers in `lib/auth-helpers.ts`
- Protected routes enforce authentication in Server Components

### Database Schema

Core models in `prisma/schema.prisma`:
- **User** - With NextAuth tables (Account, Session, VerificationToken)
- **Wallet** - Multiple wallets per user with `initialAmount` as Decimal(15,2)
- **Category** - User-specific and default categories with emoji/color
- **Transaction** - Links user, wallet, and category with amount as Decimal(15,2)
- **Budget** - Spending limits per category with period (monthly/weekly/yearly)

### Prisma Decimal Serialization

**IMPORTANT**: Prisma `Decimal` fields (like `initialAmount`, `amount`) cannot be passed directly to Client Components. Always use Prisma's `select` to fetch only needed fields or convert Decimals to numbers:

```typescript
// ✅ Good - select only needed fields
const wallets = await prisma.wallet.findMany({
  select: { id: true, name: true, icon: true }
});

// ❌ Bad - includes Decimal fields that can't serialize
const wallets = await prisma.wallet.findMany({ where: { userId } });
```

### Component Organization

- `components/ui/` - shadcn/ui base components (50+ installed)
- `components/wallets/` - Wallet-specific dialogs and forms
- `components/categories/` - Category management components
- `components/transactions/` - Transaction dialogs and forms
- `components/budgets/` - Budget creation and display
- `components/providers/` - Theme and session context providers
- `components/app-sidebar.tsx` - Main navigation with Sidebar component from shadcn/ui
- `components/theme-toggle.tsx` - Dark mode toggle

### Path Aliases

All imports use `@/` prefix mapped to project root:
- `@/components` - UI components
- `@/lib` - Utilities (prisma, auth, utils)
- `@/app/actions` - Server actions
- `@/types` - TypeScript type definitions

## Key Implementation Details

### Seeded Demo Data

Running `pnpm db:seed` creates:
- Demo user: `demo@finetrail.com` / `demo123`
- 90+ default categories with emojis for both income and expense
- Sample wallets and transactions

### Theme System

- Uses `next-themes` for dark mode with system preference detection
- Theme persisted in localStorage
- Wrapped in `ThemeProvider` in root layout
- Toggle component in sidebar

### Form Validation

All forms use React Hook Form with Zod schemas for validation:
- Type-safe form data with TypeScript inference
- Client-side validation before server action submission
- Toast notifications for success/error feedback

### Protected Routes

Dashboard routes enforce authentication:
- Server Components use `await getCurrentUser()` to get session
- Redirects to `/auth/signin` if not authenticated
- User ID from session used to filter all queries

### Dashboard Layout

Uses shadcn/ui Sidebar component with:
- Collapsible sidebar with app logo
- Navigation items for Dashboard, Wallets, Categories, Transactions, Budgets, Reports, Settings
- Theme toggle in footer
- Responsive design with mobile drawer

## Common Patterns

### Creating Server Actions

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function createResource(data: ResourceData) {
  const user = await requireAuth(); // Auth check + get user

  const resource = await prisma.resource.create({
    data: { ...data, userId: user.id }
  });

  revalidatePath("/dashboard/resources"); // Refresh UI
  return resource;
}
```

### Client Component Dialogs

Dialog components follow this pattern:
1. Accept `children` prop for trigger button
2. Accept only serializable props (no Decimal types)
3. Use `useState` for open/close state
4. Use React Hook Form with Zod validation
5. Call server action on submit
6. Show toast notification
7. Call `router.refresh()` to update Server Components
8. Close dialog and reset form on success

### Querying with Relations

```typescript
const transactions = await prisma.transaction.findMany({
  where: { userId },
  include: {
    category: true,  // Join category data
    wallet: true,    // Join wallet data
  },
  orderBy: { date: "desc" },
});
```

## Design Guidelines

- Use shadcn/ui components for all UI (never create custom base components)
- Use `cn()` utility from `lib/utils.ts` for conditional className merging
- Follow TailwindCSS conventions for spacing and typography
- Support both light and dark modes
- Ensure mobile-responsive layouts
- Use Lucide React for icons
- Apply subtle transitions with Tailwind's transition utilities

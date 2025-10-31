# Finetrail - Smart Expense Manager

A modern, full-featured personal finance management web application built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Features

### ✅ Implemented Core Features

- **Authentication**
  - Email/Password sign up and sign in
  - Google OAuth integration (configurable)
  - Secure session management with NextAuth.js
  - Protected routes and server-side authentication

- **Dashboard**
  - Overview of total balance across all wallets
  - Total income, expenses, and net savings statistics
  - Recent transactions feed
  - Wallet balances at a glance

- **Wallet Management**
  - Create multiple wallets (Cash, Bank, Credit Card, Crypto)
  - Customizable colors and icons
  - Track initial balance and current balance
  - View transaction count per wallet

- **Category Management**
  - 90+ pre-defined categories with emojis
  - Create custom categories for income and expenses
  - Color-coded categories
  - Track total spending per category

- **Transaction Tracking**
  - Add income and expense transactions
  - Assign to wallets and categories
  - Add descriptions and tags
  - Date picker for transaction dates
  - Grouped transaction feed by date
  - View transaction history

- **Budget Management**
  - Set spending limits per category
  - Weekly, monthly, or yearly budgets
  - Visual progress indicators
  - Budget alerts for overspending
  - Track remaining budget

- **UI/UX**
  - Dark mode support with system preference detection
  - Responsive design for mobile and desktop
  - 50+ shadcn/ui components (New York style)
  - Toast notifications for user feedback
  - Sidebar navigation
  - Professional, minimalist design

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS v4, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts (ready to use)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- PostgreSQL database (local or hosted)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finetrail
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: (Optional) For Google OAuth

4. Generate Prisma client and push schema:
```bash
pnpm db:generate
pnpm db:push
```

5. Seed the database with demo data:
```bash
pnpm db:seed
```

This creates a demo user with 90+ categories, sample wallets, and transactions:
- **Email**: demo@finetrail.com
- **Password**: demo123

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Scripts

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed database with demo data
pnpm db:studio      # Open Prisma Studio
```

## Project Structure

```
finetrail/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard home
│   │       ├── wallets/       # Wallet management
│   │       ├── categories/    # Category management
│   │       ├── transactions/  # Transaction feed
│   │       ├── budgets/       # Budget tracking
│   │       ├── reports/       # Reports (placeholder)
│   │       └── settings/      # Settings (placeholder)
│   ├── auth/                 # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── api/                  # API routes
│   │   └── auth/
│   ├── actions/              # Server actions
│   │   ├── wallets.ts
│   │   ├── categories.ts
│   │   ├── transactions.ts
│   │   └── budgets.ts
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components (50+)
│   ├── providers/           # Theme and session providers
│   ├── wallets/            # Wallet components
│   ├── categories/         # Category components
│   ├── transactions/       # Transaction components
│   ├── budgets/           # Budget components
│   ├── app-sidebar.tsx    # Main navigation sidebar
│   └── theme-toggle.tsx   # Dark mode toggle
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth configuration
│   ├── auth-helpers.ts     # Auth utility functions
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Seed script
└── types/
    └── next-auth.d.ts      # NextAuth type definitions
```

## Key Features Implementation

### Server Actions

All CRUD operations use Next.js server actions instead of API routes for better performance:
- `app/actions/wallets.ts` - Wallet CRUD
- `app/actions/categories.ts` - Category CRUD
- `app/actions/transactions.ts` - Transaction CRUD
- `app/actions/budgets.ts` - Budget CRUD

### Authentication

- NextAuth.js with credentials and Google providers
- Protected routes using middleware
- Server-side session validation
- Type-safe session management

### Database Schema

The Prisma schema includes:
- User (with NextAuth tables)
- Wallet (multi-wallet support)
- Category (expense and income)
- Transaction (with tags and relations)
- Budget (spending limits)

## Future Enhancements

Features ready to implement:

- **Reports & Analytics**
  - Detailed charts (pie, bar, line)
  - Custom date ranges
  - PDF/CSV export
  - Spending insights

- **Advanced Features**
  - Recurring transactions
  - Transaction attachments (receipts)
  - Budget notifications
  - Multi-currency support
  - Data export/import

- **UI Enhancements**
  - Animations with framer-motion
  - Advanced filtering
  - Search functionality
  - Bulk operations

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/finetrail"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

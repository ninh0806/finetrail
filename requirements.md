# AI Agent Prompt: Build a Complete Personal Finance Manager Web App

**Goal:**  
Build a full-featured web application for **personal expense management** using **Next.js**, **TailwindCSS v4**, **shadcn/ui**, and **PostgreSQL**.

---

## 🧩 Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript  
- **Styling:** TailwindCSS v4 + shadcn/ui components  
- **Backend:** Next.js server actions + Prisma ORM  
- **Database:** PostgreSQL  
- **Charts:** Recharts or Chart.js  
- **Auth:** NextAuth.js (with Google, Email, and Credentials providers)  
- **Deployment:** Vercel or Railway  
- **API:** REST + server actions for performance  

---

## 💡 Concept

**App name:** _Finetrail – Smart Expense Manager_

Finetrail helps users **track, analyze, and visualize their spending habits** with elegant dashboards, multi-wallet support, and social-style activity feed.

The design should feel **modern, minimalist, and professional**, like a mix of Linear and Notion aesthetics — glowing accents, fluid animations, and a strong sense of clarity.

---

## 🎯 Core Features

### 1. Authentication
- Sign up / sign in (Google, Email)
- Secure session handling
- Personalized dashboard after login

### 2. Wallets Management
- Create multiple wallets (Cash, Bank, Credit Card, Crypto, etc.)
- Each wallet has:
  - Name, currency, icon/color theme
  - Initial balance, sync date
  - Aggregated statistics
- Quick wallet switcher (top navigation dropdown)

### 3. Transactions
- Add income or expense with:
  - Amount, category, description, date, tags
  - Optional attachments (e.g., receipt image)
  - Linked wallet
- Edit/delete transactions
- Bulk import via CSV (optional)

### 4. Categories
- Default categories (Food, Travel, Bills, etc.)
- User-defined custom categories
- Color and emoji picker for each

### 5. Dashboard & Insights
- Monthly overview with:
  - Total income, total expense, net savings
  - Expense breakdown by category
  - Balance trend line chart
  - Top spending categories
- Time range filter (Day, Week, Month, Custom)
- Currency symbol formatting based on locale

### 6. Timeline Feed
- Interactive chronological “feed” of spending:
  - Shows transactions grouped by date
  - Smooth fade-in animations
  - “Today”, “Yesterday”, “This week” sections
- Optional notes and emojis for personalization

### 7. Reports & Analytics
- Advanced filters: wallet, category, tag, period
- Pie, bar, and line charts
- Export PDF/CSV report
- Monthly summary cards (“You spent 15% less on dining this month 🍱”)

### 8. Goals & Budgets
- Set spending limits per category or wallet
- Visual progress indicators
- Alert when nearing or exceeding limits
- “Smart budget suggestions” based on history

### 9. Dark Mode + Theme Customization
- Light / dark toggle
- Accent color options (e.g., violet, emerald, amber)
- Persisted via localStorage

### 10. Notifications & Activity
- Optional reminders for recurring bills
- Toast notifications using shadcn/ui
- Daily spending summary notification (optional via email)

---

## 🧠 Bonus Ideas (Optional Enhancements)
- **AI Assistant:** “What did I spend the most on last month?” → auto-generate report.
- **Collaborative Mode:** Share wallets with family members (role-based access).
- **Recurring Transactions:** Auto-add monthly subscriptions, rent, etc.
- **Mobile Responsive:** Adaptive design optimized for mobile dashboards.
- **Offline Cache:** Local caching for recent transactions (IndexedDB).

---

## 🎨 UI Design Notes

- Use **shadcn/ui components**: Card, Dialog, DropdownMenu, Tabs, Skeleton, Toast, Chart wrappers.
- Keep consistent spacing and typography using Tailwind’s `space-y-*`, `font-semibold`, `text-muted-foreground`.
- Apply subtle glassmorphism and motion transitions with `framer-motion`.
- Dashboard Layout:
  - **Sidebar:** Wallets, Categories, Settings
  - **Topbar:** Date range, Add Transaction button
  - **Main Area:** Charts + Feed + Summary Cards

---

## 🗂️ Database Schema (Prisma Example)

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String?  @unique
  image         String?
  wallets       Wallet[]
  transactions  Transaction[]
  categories    Category[]
  budgets       Budget[]
  createdAt     DateTime @default(now())
}

model Wallet {
  id            String   @id @default(cuid())
  userId        String
  name          String
  currency      String
  color         String?
  initialAmount Decimal   @default(0)
  transactions  Transaction[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
}

model Category {
  id            String   @id @default(cuid())
  userId        String
  name          String
  color         String?
  emoji         String?
  transactions  Transaction[]
  user          User      @relation(fields: [userId], references: [id])
}

model Transaction {
  id            String   @id @default(cuid())
  userId        String
  walletId      String
  categoryId    String?
  type          String // income | expense
  amount        Decimal
  description   String?
  date          DateTime
  tags          String[]
  createdAt     DateTime @default(now())
  wallet        Wallet   @relation(fields: [walletId], references: [id])
  category      Category? @relation(fields: [categoryId], references: [id])
  user          User     @relation(fields: [userId], references: [id])
}

model Budget {
  id            String   @id @default(cuid())
  userId        String
  categoryId    String
  amount        Decimal
  period        String // monthly, weekly
  createdAt     DateTime @default(now())
  user          User      @relation(fields: [userId], references: [id])
  category      Category  @relation(fields: [categoryId], references: [id])
}
````

---

## 🚀 Expected Output

* A **production-ready** web app scaffolded in **Next.js 14** using the above schema.
* Fully styled UI with **shadcn/ui** and **TailwindCSS 4**.
* Modular, maintainable folder structure:

  ```
  app/
    (auth)/
    (dashboard)/
    (wallets)/
    (transactions)/
  components/
  lib/
  prisma/
  utils/
  ```
* Use `use server` actions for CRUD.
* Include seed data for demo.
* Charts and feed should be **interactive and animated**.

---

## 🧭 Deliverables

1. Complete source code.
2. Seeded PostgreSQL database ready for local use.
3. Clear README with setup instructions.
4. Clean UI showcasing dashboard, charts, and timeline feed.

---

**Tone:** Futuristic, minimal, professional.
**Goal:** Impress both developers and casual users with a beautiful, data-driven personal finance dashboard.

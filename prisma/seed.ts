import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
  // 🧾 Expense Categories
  { name: "Food & Dining", emoji: "🍔", color: "#ef4444", type: "expense" },
  { name: "Groceries", emoji: "🛒", color: "#84cc16", type: "expense" },
  { name: "Coffee & Snacks", emoji: "☕", color: "#f59e0b", type: "expense" },
  { name: "Transportation", emoji: "🚗", color: "#f97316", type: "expense" },
  { name: "Parking", emoji: "🅿️", color: "#fb923c", type: "expense" },
  { name: "Fuel / Gas", emoji: "⛽", color: "#ea580c", type: "expense" },
  { name: "Shopping", emoji: "🛍️", color: "#ec4899", type: "expense" },
  { name: "Clothing", emoji: "👕", color: "#e879f9", type: "expense" },
  { name: "Accessories", emoji: "⌚", color: "#c084fc", type: "expense" },
  { name: "Entertainment", emoji: "🎮", color: "#a855f7", type: "expense" },
  {
    name: "Movies & Streaming",
    emoji: "🎬",
    color: "#7e22ce",
    type: "expense",
  },
  {
    name: "Music & Subscriptions",
    emoji: "🎧",
    color: "#6366f1",
    type: "expense",
  },
  { name: "Bills & Utilities", emoji: "⚡", color: "#eab308", type: "expense" },
  { name: "Internet", emoji: "🌐", color: "#0284c7", type: "expense" },
  { name: "Mobile Plan", emoji: "📱", color: "#38bdf8", type: "expense" },
  { name: "Rent", emoji: "🏠", color: "#facc15", type: "expense" },
  { name: "Maintenance", emoji: "🔧", color: "#a3a3a3", type: "expense" },
  { name: "Healthcare", emoji: "🏥", color: "#10b981", type: "expense" },
  { name: "Insurance", emoji: "🩺", color: "#22c55e", type: "expense" },
  { name: "Education", emoji: "📚", color: "#3b82f6", type: "expense" },
  { name: "Online Courses", emoji: "💻", color: "#60a5fa", type: "expense" },
  { name: "Childcare", emoji: "🧸", color: "#f9a8d4", type: "expense" },
  { name: "Travel", emoji: "✈️", color: "#06b6d4", type: "expense" },
  { name: "Hotel & Lodging", emoji: "🏨", color: "#0ea5e9", type: "expense" },
  {
    name: "Vacation Activities",
    emoji: "🏖️",
    color: "#14b8a6",
    type: "expense",
  },
  { name: "Fitness", emoji: "💪", color: "#f43f5e", type: "expense" },
  { name: "Gym Membership", emoji: "🏋️‍♂️", color: "#ef4444", type: "expense" },
  { name: "Sports Equipment", emoji: "⚽", color: "#b91c1c", type: "expense" },
  { name: "Personal Care", emoji: "💅", color: "#ec4899", type: "expense" },
  { name: "Gifts & Donations", emoji: "🎁", color: "#d946ef", type: "expense" },
  { name: "Pets", emoji: "🐶", color: "#f59e0b", type: "expense" },
  { name: "Home Improvement", emoji: "🪚", color: "#92400e", type: "expense" },
  { name: "Other Expenses", emoji: "📝", color: "#64748b", type: "expense" },

  // 💵 Income Categories
  { name: "Salary", emoji: "💰", color: "#10b981", type: "income" },
  { name: "Freelance", emoji: "💼", color: "#3b82f6", type: "income" },
  { name: "Consulting", emoji: "🧑‍💻", color: "#2563eb", type: "income" },
  { name: "Investment", emoji: "📈", color: "#8b5cf6", type: "income" },
  { name: "Dividends", emoji: "💹", color: "#7c3aed", type: "income" },
  { name: "Rental Income", emoji: "🏘️", color: "#059669", type: "income" },
  { name: "Side Hustle", emoji: "🛠️", color: "#16a34a", type: "income" },
  { name: "Gift", emoji: "🎁", color: "#ec4899", type: "income" },
  { name: "Cashback & Rewards", emoji: "🎟️", color: "#facc15", type: "income" },
  { name: "Other Income", emoji: "💵", color: "#14b8a6", type: "income" },

  // 💰 Savings & Investments
  { name: "Emergency Fund", emoji: "🧯", color: "#f87171", type: "expense" },
  { name: "Savings Deposit", emoji: "🏦", color: "#22c55e", type: "income" },
  { name: "Stock Purchase", emoji: "📊", color: "#7dd3fc", type: "expense" },
  { name: "Crypto Investment", emoji: "🪙", color: "#0ea5e9", type: "expense" },
  { name: "Mutual Funds", emoji: "💼", color: "#4ade80", type: "expense" },
  { name: "Retirement", emoji: "👴", color: "#15803d", type: "expense" },

  // 🔁 Transfers
  {
    name: "Transfer to Wallet",
    emoji: "🔄",
    color: "#6366f1",
    type: "expense",
  },
  {
    name: "Transfer from Wallet",
    emoji: "🔁",
    color: "#4f46e5",
    type: "income",
  },

  // 🎉 Fun & Lifestyle
  { name: "Night Out", emoji: "🍸", color: "#f43f5e", type: "expense" },
  { name: "Hobbies", emoji: "🎨", color: "#a855f7", type: "expense" },
  { name: "Concerts & Events", emoji: "🎤", color: "#ec4899", type: "expense" },
  { name: "Books", emoji: "📖", color: "#60a5fa", type: "expense" },
  { name: "Gaming", emoji: "🕹️", color: "#8b5cf6", type: "expense" },
  {
    name: "Streaming Services",
    emoji: "📺",
    color: "#2563eb",
    type: "expense",
  },
  { name: "Dating", emoji: "💘", color: "#f472b6", type: "expense" },
  { name: "Beauty & Spa", emoji: "💆‍♀️", color: "#e879f9", type: "expense" },

  // 🧭 Miscellaneous
  { name: "Taxes", emoji: "🧾", color: "#f97316", type: "expense" },
  { name: "Loan Payment", emoji: "💳", color: "#dc2626", type: "expense" },
  { name: "Charity", emoji: "🙏", color: "#22c55e", type: "expense" },
  {
    name: "Unexpected Expense",
    emoji: "⚠️",
    color: "#f87171",
    type: "expense",
  },
];


async function main() {
  console.log("🌱 Starting seed...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@finetrail.com" },
    update: {},
    create: {
      email: "demo@finetrail.com",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  console.log("✅ Created demo user:", demoUser.email);

  // Create default categories for demo user
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        userId: demoUser.id,
        name: category.name,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          userId: demoUser.id,
          name: category.name,
          emoji: category.emoji,
          color: category.color,
          type: category.type,
          isDefault: true,
        },
      });
    }
  }

  console.log("✅ Created default categories");

  // Create demo wallets
  const cashWallet = await prisma.wallet.create({
    data: {
      userId: demoUser.id,
      name: "Cash",
      type: "cash",
      currency: "USD",
      color: "#10b981",
      icon: "💵",
      initialAmount: 500,
    },
  });

  const bankWallet = await prisma.wallet.create({
    data: {
      userId: demoUser.id,
      name: "Bank Account",
      type: "bank",
      currency: "USD",
      color: "#3b82f6",
      icon: "🏦",
      initialAmount: 5000,
    },
  });

  const creditWallet = await prisma.wallet.create({
    data: {
      userId: demoUser.id,
      name: "Credit Card",
      type: "credit_card",
      currency: "USD",
      color: "#8b5cf6",
      icon: "💳",
      initialAmount: 0,
    },
  });

  console.log("✅ Created demo wallets");

  // Create some demo transactions
  const foodCategory = await prisma.category.findFirst({
    where: { userId: demoUser.id, name: "Food & Dining" },
  });

  const salaryCategory = await prisma.category.findFirst({
    where: { userId: demoUser.id, name: "Salary" },
  });

  if (foodCategory && salaryCategory) {
    // Add salary transaction
    await prisma.transaction.create({
      data: {
        userId: demoUser.id,
        walletId: bankWallet.id,
        categoryId: salaryCategory.id,
        type: "income",
        amount: 5000,
        description: "Monthly salary",
        date: new Date(),
        tags: ["salary", "monthly"],
      },
    });

    // Add expense transactions
    await prisma.transaction.create({
      data: {
        userId: demoUser.id,
        walletId: cashWallet.id,
        categoryId: foodCategory.id,
        type: "expense",
        amount: 45.50,
        description: "Lunch at restaurant",
        date: new Date(),
        tags: ["food", "lunch"],
      },
    });

    console.log("✅ Created demo transactions");
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

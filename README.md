# Better Auth Starter

A comprehensive authentication solution built with [Better Auth](https://better-auth.com), Next.js, and modern web technologies. This starter template provides enterprise-grade authentication features including multi-factor authentication, organization management, admin panels, and more.

## ✨ Features

### 🔐 Authentication

- **Email & Password** authentication with secure password hashing
- **OAuth Providers** - Social login support
- **Passkey Support** - Passwordless authentication
- **Two-Factor Authentication (2FA)** - OTP and authenticator app support
- **Password Reset** - Secure password recovery flow
- **Email Verification** - Verify user email addresses
- **Have I Been Pwned Integration** - Check passwords against known breaches

### 👥 User Management

- **User Profiles** - Complete user profile management
- **Account Settings** - Security, password, and profile settings
- **Delete Account** - User-initiated account deletion
- **Change Email** - Secure email change with verification
- **Admin Panel** - Comprehensive user and organization management

### 🏢 Organization Management

- **Create Organizations** - Multi-tenant organization support
- **Invite Members** - Email-based invitation system
- **Role-Based Access Control (RBAC)** - Manage user roles and permissions
- **Organization Settings** - Configure organization details
- **Member Management** - Add, remove, and manage organization members

### 🛡️ Security Features

- **Rate Limiting** - Redis-based rate limiting for API endpoints
- **Google reCAPTCHA** - Bot protection on authentication forms
- **Session Management** - Secure session handling with cookie caching
- **API Keys** - Generate and manage API keys for service-to-service authentication
- **Last Login Method** - Track how users last authenticated

### 💳 Billing Integration

- **Polar Integration** - Built-in billing and subscription management
- **Checkout Flow** - Seamless payment processing
- **Customer Portal** - Self-service billing management

### 🎨 UI/UX

- **Modern Design** - Built with Tailwind CSS and Radix UI
- **Dark Mode** - Full dark mode support with next-themes
- **Responsive** - Mobile-first responsive design
- **Data Tables** - Advanced data tables with sorting, filtering, and pagination
- **Interactive Charts** - Data visualization with Recharts
- **Toast Notifications** - User feedback with Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis server
- Google reCAPTCHA keys (optional)
- Polar account for billing (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/alex289/better-auth-starter.git
cd better-auth-starter
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Redis
REDIS_URL=redis://localhost:6379

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here

# Google reCAPTCHA (optional)
GOOGLE_RECAPTCHA_SECRET_KEY=your-recaptcha-secret
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Email (configure your email provider)
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password

# Polar (optional - for billing)
POLAR_ACCESS_TOKEN=your-polar-access-token
```

4. **Start the database and Redis with Docker**

```bash
docker compose up -d
```

5. **Run database migrations**

```bash
pnpm drizzle-kit push
```

6. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes (sign-in, sign-up, etc.)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── admin/             # Admin panel routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── dialogs/          # Dialog components
│   └── table/            # Data table components
├── db/                    # Database configuration
│   ├── schema.ts         # Drizzle ORM schema
│   ├── queries.ts        # Database queries
│   └── drizzle/          # Drizzle migrations
├── email/                 # Email templates (React Email)
├── hooks/                 # Custom React hooks
└── lib/                   # Utility libraries
    ├── auth.ts           # Better Auth configuration
    ├── auth-client.ts    # Client-side auth utilities
    ├── email.tsx         # Email sending utilities
    └── utils.ts          # Helper functions
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Beta)](https://nextjs.org/) - React framework with App Router
- **Authentication**: [Better Auth](https://better-auth.com) - Comprehensive authentication library
- **Database**: [PostgreSQL](https://postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Cache/Rate Limiting**: [Redis](https://redis.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Email**: [React Email](https://react.email/) + [Nodemailer](https://nodemailer.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Data Tables**: [TanStack Table](https://tanstack.com/table)
- **Charts**: [Recharts](https://recharts.org/)
- **Billing**: [Polar](https://polar.sh/)

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm email        # Run email preview server on port 3001
pnpm typegen      # Generate TypeScript types
```

## 🔧 Configuration

### Better Auth Configuration

The main authentication configuration is in `src/lib/auth.ts`. You can customize:

- Authentication providers
- Session settings
- Rate limiting
- Email templates
- Organization settings
- Admin permissions
- API key configuration

### Database Schema

Database schema is defined in `src/db/schema.ts` using Drizzle ORM. To modify the schema:

1. Edit `src/db/schema.ts`
2. Run `pnpm drizzle-kit generate` to generate migrations
3. Run `pnpm drizzle-kit push` to apply migrations

## 🎨 Customization

### Styling

The project uses Tailwind CSS with a custom design system configured in `tailwind.config.ts`. Colors, fonts, and other design tokens can be customized in the configuration file.

### Email Templates

Email templates are built with React Email in the `src/email` directory. Preview emails by running:

```bash
pnpm email
```

Then visit [http://localhost:3001](http://localhost:3001)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Docker

```bash
docker build -t better-auth-starter .
docker run -p 3000:3000 better-auth-starter
```

Make sure to configure your PostgreSQL and Redis connections appropriately.

## 🔒 Security Best Practices

- Always use HTTPS in production
- Keep `BETTER_AUTH_SECRET` secure and rotate it regularly
- Use strong passwords for database and Redis
- Configure rate limiting appropriately for your use case
- Enable reCAPTCHA to prevent bot attacks
- Review and customize CORS settings
- Keep dependencies updated

## 📚 Learn More

- [Better Auth Documentation](https://better-auth.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Better Auth](https://better-auth.com) for the amazing authentication library
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- [Vercel](https://vercel.com) for Next.js and hosting platform

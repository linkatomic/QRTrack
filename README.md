# QRTrack - Smart QR Codes & Analytics

QRTrack is a modern, production-ready SaaS platform for creating QR codes with powerful analytics and tracking capabilities. Built with Next.js 13, Supabase, and TypeScript.

## Features

- **QR Code Generation**: Create custom QR codes with your brand colors
- **UTM Parameter Builder**: Built-in UTM tracking for seamless analytics integration
- **Real-Time Analytics**: Track scans by device, location, browser, and more
- **SEO-Optimized Landing Pages**: Auto-generated public pages for each QR code
- **Scan Tracking**: Detailed metrics on every scan with device fingerprinting
- **User Authentication**: Secure email/password authentication via Supabase
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: shadcn/ui, Tailwind CSS
- **QR Generation**: qrcode library
- **Analytics**: Custom analytics engine with device detection
- **Deployment**: Vercel-ready

## Database Setup

Before running the application, you need to set up your Supabase database.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

### 2. Run the Database Migration

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Open the `database-setup.sql` file from this project
4. Copy and paste the entire SQL script into the SQL Editor
5. Click "Run" to execute the migration

This will create:
- `profiles` table for user data
- `qr_codes` table for QR code management
- `scans` table for analytics tracking
- All necessary indexes, triggers, and Row Level Security policies

### 3. Enable Email Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Ensure "Email" is enabled
3. Disable "Confirm email" if you want instant signups (recommended for development)

## Environment Variables

The environment variables are already configured in `.env`. Your Supabase project URL and anonymous key should already be set.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── app/                          # Next.js 13 App Router
│   ├── api/                      # API routes
│   │   └── track/                # Scan tracking endpoint
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── create/               # Create QR code page
│   │   └── qr/[id]/              # QR code detail & analytics
│   ├── qr/[shortCode]/           # Public QR landing pages
│   ├── r/[shortCode]/            # Redirect & tracking endpoint
│   ├── sign-in/                  # Authentication pages
│   └── sign-up/
├── components/                   # React components
│   ├── auth/                     # Authentication forms
│   ├── dashboard/                # Dashboard components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities and configuration
│   ├── auth/                     # Auth context & helpers
│   ├── qr/                       # QR code generation
│   ├── supabase/                 # Supabase client & types
│   └── utils/                    # URL builders, parsers
└── database-setup.sql            # Database migration script
```

## Key Features Explained

### QR Code Creation

Users can create QR codes with:
- Custom destination URLs
- UTM parameters for campaign tracking
- Custom colors
- SEO-optimized landing pages
- Expiration dates

### Analytics Dashboard

Track every scan with:
- Device type (mobile, tablet, desktop)
- Operating system and browser
- Geographic location (country/city)
- Referrer information
- Timestamp of each scan
- Total scan counts

### Public Landing Pages

Each QR code can have an optional landing page featuring:
- Custom title and description (SEO optimized)
- Logo/branding
- Call-to-action button
- Destination URL preview
- Automatic Open Graph meta tags

### Scan Tracking

When a QR code is scanned:
1. User is redirected through `/r/[shortCode]`
2. Scan event is tracked via API
3. User agent and IP are parsed for analytics
4. User is redirected to destination with UTM parameters
5. Analytics are updated in real-time

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own QR codes
- Scan insertion is public (for tracking)
- Authentication via Supabase Auth
- Secure session management

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Environment variables are automatically detected from `.env`
4. Deploy!

### Environment Variables for Production

Ensure these are set in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Future Enhancements

Potential additions for V2:
- Custom domains for QR codes
- A/B testing with multiple destinations
- Advanced analytics with charts
- CSV/PDF export of analytics
- Team workspaces
- API access
- Webhook notifications
- Dynamic QR code updates

## License

This project is built for demonstration and production use.

# Composer Kit

A modern, feature-rich Next.js 14 boilerplate with authentication, API rate limiting, and a beautiful UI powered by shadcn/ui.

## Features

- 🚀 **Next.js 14** with App Router
- 🔐 **Authentication** via Supabase
- 🎨 **Styling**
  - Tailwind CSS
  - shadcn/ui components
  - Dark mode support
  - Custom theme configuration
- 🛠️ **Development Tools**
  - TypeScript
  - ESLint
  - Prettier
- 📊 **API Features**
  - Rate limiting with Upstash Redis
  - Edge runtime support
  - API route handlers
- 🏗️ **Architecture**
  - Modular component structure
  - Custom hooks
  - Global state management with Zustand
  - Error boundaries
  - Loading states
- 🔄 **Data Management**
  - Supabase database integration
  - Type-safe database queries
  - Optimistic updates

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/composer-kit.git
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js 14 app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── ...
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
│   ├── store/         # Zustand store configurations
│   ├── supabase/      # Supabase related utilities
│   └── utils/         # Helper functions
└── types/             # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment

This project can be deployed to any platform that supports Next.js, such as:

- Vercel
- Netlify
- AWS
- Docker containers

## Suggested Improvements

1. **Authentication Enhancements**

   - Social login providers (Google, GitHub)
   - Magic link authentication
   - Two-factor authentication

2. **Performance Optimizations**

   - Implement React Suspense boundaries
   - Add image optimization
   - Configure Webpack bundle analyzer

3. **Testing**

   - Add Jest for unit testing
   - Implement React Testing Library
   - Add Cypress for E2E testing

4. **Security**

   - Add CSRF protection
   - Implement security headers
   - Add input sanitization

5. **Developer Experience**

   - Add Storybook for component documentation
   - Implement Git hooks with Husky
   - Add automated changelog generation

6. **Features**

   - Add real-time subscriptions with Supabase
   - Implement file upload functionality
   - Add search functionality
   - Create admin dashboard

7. **Monitoring**

   - Add error tracking (Sentry)
   - Implement analytics
   - Add performance monitoring

8. **Documentation**
   - Add JSDoc comments
   - Create API documentation
   - Add component documentation

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue or contact the maintainers.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Upstash](https://upstash.com/)

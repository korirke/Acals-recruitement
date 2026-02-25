# Fortune Technologies - Frontend Web Application

A modern, responsive web application built with Next.js 15, TypeScript, and Tailwind CSS for Fortune Technologies, featuring a comprehensive admin panel and dynamic content management.

## 🚀 Features

### Public Website

- **Dynamic Navigation** - Multi-level dropdown menus with hover effects
- **Hero Sections** - Customizable hero banners with CTA buttons
- **Service Pages** - Detailed service descriptions with features
- **Client Showcase** - Logo carousel of trusted clients
- **Testimonials** - Customer reviews and success stories
- **Statistics** - Key metrics and achievements
- **Contact Forms** - Lead capture and consultation requests
- **Blog System** - Content management with categories and authors
- **Dark Mode** - Persistent theme switching
- **Responsive Design** - Mobile-first approach

### Admin Panel

- **Dashboard** - Overview of key metrics and recent activities
- **Content Management** - Pages, services, blog posts, testimonials
- **Appearance Settings** - Theme colors, navigation, hero sections
- **Media Library** - File uploads and management
- **User Management** - Roles, permissions, and access control
- **CRM** - Leads tracking and newsletter management
- **Recruitment** - Job postings and application management
- **Analytics** - Performance tracking and reporting
- **Audit Logs** - System activity monitoring

## 📁 Project Structure

```
fortune-technologies-web/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── ChatWidgetLoader.tsx
│   │
│   ├── (public)/
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── resources/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── payroll/
│   │   │   │   └── page.tsx
│   │   │   ├── recruitment/
│   │   │   │   └── page.tsx
│   │   │   ├── outsourcing/
│   │   │   │   └── page.tsx
│   │   │   ├── hr-consulting/
│   │   │   │   └── page.tsx
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── technology/
│   │   │   ├── hr-system/
│   │   │   │   └── page.tsx
│   │   │   └── web-development/
│   │   │       └── page.tsx
│   │   ├── security/
│   │   │   └── cctv/
│   │   │       └── page.tsx
│   │   ├── clients/
│   │   │   ├── small-business/
│   │   │   │   └── page.tsx
│   │   │   ├── medium-business/
│   │   │   │   └── page.tsx
│   │   │   └── enterprise/
│   │   │       └── page.tsx
│   │   ├── industries/
│   │   │   ├── manufacturing/
│   │   │   │   └── page.tsx
│   │   │   ├── healthcare/
│   │   │   │   └── page.tsx
│   │   │   ├── education/
│   │   │   │   └── page.tsx
│   │   │   ├── financial/
│   │   │   │   └── page.tsx
│   │   │   └── retail/
│   │   │       └── page.tsx
│   │   └── why-paywell/
│   │       ├── local-expertise/
│   │       │   └── page.tsx
│   │       ├── support/
│   │       │   └── page.tsx
│   │       ├── cost-effective/
│   │       │   └── page.tsx
│   │       ├── track-record/
│   │       │   └── page.tsx
│   │       ├── cloud/
│   │       │   └── page.tsx
│   │       └── mobile/
│   │           └── page.tsx
│   │
│   ├── (admin)/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── navigation/
│   │   │   │   └── page.tsx
│   │   │   ├── hero-dashboards/
│   │   │   │   └── page.tsx
│   │   │   ├── theme/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── roles/
│   │   │   │   └── page.tsx
│   │   │   ├── content/
│   │   │   │   ├── pages/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── blog/
│   │   │   │       ├── posts/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── categories/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── authors/
│   │   │   │           └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── page.tsx
│   │   │   ├── marketing/
│   │   │   │   ├── testimonials/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── case-studies/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── newsletter/
│   │   │   │       └── page.tsx
│   │   │   ├── crm/
│   │   │   │   └── leads/
│   │   │   │       └── page.tsx
│   │   │   ├── recruitment/
│   │   │   │   ├── departments/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── locations/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── jobs/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── applications/
│   │   │   │       └── page.tsx
│   │   │   ├── media/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── audit-logs/
│   │   │       └── page.tsx
│   │   └── components/
│   │       └── AdminSidebar.tsx
│   │
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       ├── forgot-password/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
│
├── components/
│   ├── icons/
│   │   └── index.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Stats.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ContactUs.tsx
│   │   └── Solutions.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ThemeToggle.tsx
│   ├── auth/
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ResetPasswordForm.tsx
│   └── providers/
│       └── ThemeProvider.tsx
│
├── lib/
│   ├── apiClient.ts
│   ├── utils.ts
│   ├── cache.ts
│   ├── fallbacks.ts
│   ├── constants.ts
│   └── types.ts
│
├── contexts/
│   ├── NavigationContext.tsx
│   ├── DynamicThemeContext.tsx
│   └── AuthContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useNavigation.ts
│   ├── useTheme.ts
│   └── useLocalStorage.ts
│
├── services/
│   ├── navigationService.ts
│   ├── heroService.ts
│   ├── testimonialsService.ts
│   ├── statsService.ts
│   └── featuresService.ts
│
├── utils/
│   ├── performance.ts
│   ├── seo.ts
│   └── validation.ts
│
├── types/
│   ├── api.ts
│   ├── navigation.ts
│   ├── hero.ts
│   ├── testimonials.ts
│   └── index.ts
│
├── public/
│   └── logo.png
│
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16.3 (App Router)
- **Runtime:** React 19.1.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 12.23.18
- **Icons:** Lucide React 0.544.0
- **Rich Text Editor:** TinyMCE React 6.3.0
- **Image Carousel:** Keen Slider 6.8.6
- **Search:** Fuse.js 7.1.0
- **Notifications:** React Hot Toast 2.6.0

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/fortune-technologies-web.git
cd fortune-technologies-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel --prod
```

## 🎨 Theming

The application supports dynamic theming with the following customization options:

- Primary color customization
- Secondary color customization
- Accent color customization
- Logo upload
- Font selection
- Border radius settings

Theme preferences are persisted in localStorage and sync across browser tabs.

## 🔐 Authentication

The application includes comprehensive authentication features:

- Login and registration pages
- JWT token management
- Protected routes with middleware
- Role-based access control (Admin, User)
- Password reset functionality
- Secure session management

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

All components follow a mobile-first design approach for optimal user experience.

## 🧪 Testing & Code Quality

### Run Linting

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint:fix
```

## 📊 Performance

The application implements several performance optimization strategies:

- Lazy loading for images and components
- Automatic code splitting with Next.js
- Strategic API response caching
- Optimized images with Next.js Image component
- Prefetching for faster navigation
- Service worker integration for offline support

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

We follow these coding standards:

- TypeScript for all files with type safety
- ESLint rules for code consistency
- Tailwind CSS utility classes for styling
- Component-based architecture
- Functional components with React hooks
- Proper error handling and logging

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build -- --debug
```

## 📄 License

This project is proprietary software of Fortune Technologies. Unauthorized copying or distribution is prohibited.

## 📞 Support

For issues, questions, or feature requests, please contact the development team or open an issue in the repository.

---

**Last Updated:** November 2025
**Version:** 1.0.0
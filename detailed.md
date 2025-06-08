# NNP (Hindi News Website) — Ultra-Detailed Website Recreation Guide

This document provides an exhaustive, step-by-step specification for recreating the NNP news website. NNP is a modern, responsive news portal primarily focused on delivering content in Hindi. The level of detail is intended to be sufficient for a developer or an advanced AI to reconstruct the project with perfect fidelity, including its structure, design, and functionality.

## Part 1: Foundational Setup

This section covers the core project structure, technology stack, and data models.

### 1.1 — Complete Project File Structure

The project is organized using the Next.js App Router paradigm within the `src` directory. Below is the exact file and directory structure.

```
src/
├── ai/
│   ├── dev.ts
│   └── genkit.ts
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── app-layout.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── footer.tsx
│   │   ├── hamburger-menu.tsx
│   │   ├── navbar.tsx
│   │   └── sidebar-nav.tsx
│   ├── news/
│   │   ├── article-card.tsx
│   │   ├── article-detail.tsx
│   │   ├── category-news-list.tsx
│   │   ├── headline-display.tsx
│   │   ├── related-articles.tsx
│   │   ├── search-results-list.tsx
│   │   └── trending-topics.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── tooltip.tsx
│   └── search-bar.tsx
├── flows/
│   └── suggest-related-articles.ts
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── firebase-data.ts
│   ├── firebase.ts
│   ├── placeholder-data.ts
│   ├── types.ts
│   └── utils.ts
└── types/
    └── custom.d.ts
```

### 1.2 — Technology Stack

- **Framework**: Next.js 15.2.3
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend & DB**: Firebase (Authentication, Realtime Database)
- **Bundler**: Turbopack (via `next dev --turbopack`)
- **AI/Generative**: Genkit

### 1.3 — Data Models

These are the core TypeScript types defined in `src/lib/types.ts`.

**Article**
```typescript
export type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  categorySlug: string;
  categoryName: string;
  publishedAt: string; // ISO 8601 format
  author?: string;
  dataAiHint?: string;
};
```

**Category**
```typescript
import type { LucideIcon } from 'lucide-react';

export type Category = {
  name: string;
  slug: string;
  icon: LucideIcon;
};
```

**NavItem**
```typescript
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
```

### 1.4 — Static Data & Content

This data is defined in `src/lib/placeholder-data.ts` and is used to populate navigation and categories throughout the site.

**All Categories**
This is the complete list of news categories. The primary language for the content and categories is Hindi, as shown in the `name` property of each category object.

```typescript
import { Briefcase, Cpu, Landmark, Trophy, Globe, Film, HeartPulse, Atom, MessageSquare } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { name: 'राजनीति', slug: 'politics', icon: Landmark },
  { name: 'व्यापार', slug: 'business', icon: Briefcase },
  { name: 'प्रौद्योगिकी', slug: 'technology', icon: Cpu },
  { name: 'खेल', slug: 'sports', icon: Trophy },
  { name: 'विश्व', slug: 'world', icon: Globe },
  { name: 'मनोरंजन', slug: 'entertainment', icon: Film },
  { name: 'स्वास्थ्य', slug: 'health', icon: HeartPulse },
  { name: 'विज्ञान', slug: 'science', icon: Atom },
  { name: 'राय', slug: 'opinion', icon: MessageSquare },
];
```

**All Navigation Items**
This is the complete list of navigation items for the sidebar. It is dynamically constructed by combining a "Home" link, all categories, and an "Admin" link.

```typescript
import { Home, Shield } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'होम', icon: Home },
  ...CATEGORIES.map(category => ({
    href: `/category/${category.slug}`,
    label: category.name,
    icon: category.icon,
  })),
  { href: '/admin', label: 'एडमिन पैनल', icon: Shield },
];
```

## Part 2: Design System and Theming

This section details the entire design system, from Tailwind CSS configuration to the specific color variables.

### 2.1 — Tailwind CSS Configuration

File: `tailwind.config.ts`

This file configures Tailwind to work with the project's structure and design tokens.

**Content Paths**
The `content` array tells Tailwind where to scan for class names.
```javascript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**Dark Mode**
Dark mode is enabled and controlled by adding a `.dark` class to a parent element (typically `<html>`).
```javascript
darkMode: ['class'],
```

**Container**
The `.container` class is configured to be centered, have `2rem` of padding by default, and a max-width of `1400px` on `2xl` screens.
```javascript
container: {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
},
```

**Theme Extensions**
The `extend` block adds custom design tokens.

*   **Fonts**:
    ```javascript
    fontFamily: {
      body: ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
      headline: ['Poppins', 'Noto Sans Devanagari', 'sans-serif'],
      code: ['monospace'],
    },
    ```
*   **Border Radius**: The border radius values are mapped to a CSS variable `--radius` for consistency.
    ```javascript
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
    ```
*   **Colors**: All colors are mapped to CSS variables, allowing for dynamic theming.
    ```javascript
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      // ... and so on for primary, secondary, card, etc.
    },
    ```
*   **Keyframes & Animations**: Defines animations for components like accordions.
    ```javascript
    keyframes: {
      'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
      'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
    ```

**Plugins**
```javascript
plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
```

### 2.2 — Global CSS and Color Palette

File: `src/app/globals.css`

This file defines the color palettes via CSS variables.

**Default Theme: Violet-Blue (Light Mode)**
```css
:root {
  --background: 240 20% 12%;       /* HSL for #1A1F2E */
  --foreground: 240 15% 88%;       /* HSL for #D9DCEB */
  --card: 240 20% 18%;             /* HSL for #242938 */
  --card-foreground: 240 15% 85%;  /* HSL for #D2D6E6 */
  --popover: 240 20% 15%;          /* HSL for #1F2433 */
  --popover-foreground: 240 15% 85%; /* HSL for #D2D6E6 */
  --primary: 240 70% 65%;          /* HSL for #6B7BDE */
  --primary-foreground: 240 60% 95%; /* HSL for #E8ECFB */
  --secondary: 240 40% 30%;        /* HSL for #334166 */
  --secondary-foreground: 240 15% 80%; /* HSL for #C6CCDE */
  --muted: 240 20% 25%;            /* HSL for #33384D */
  --muted-foreground: 240 15% 70%; /* HSL for #A9B0CC */
  --accent: 240 60% 55%;           /* HSL for #5267C9 */
  --accent-foreground: 240 60% 95%; /* HSL for #E8ECFB */
  --destructive: 0 84.2% 60.2%;    /* HSL for #F84F4F */
  --destructive-foreground: 0 0% 98%; /* HSL for #FAFAFA */
  --border: 240 20% 28%;           /* HSL for #393E52 */
  --input: 240 20% 22%;            /* HSL for #2D3345 */
  --ring: 240 70% 70%;             /* HSL for #808EE5 */
  --radius: 0.5rem;
}
```

**Dark Theme: Black & Gray**
```css
.dark {
  --background: 220 10% 15%;       /* HSL for #232629 */
  --foreground: 220 10% 90%;       /* HSL for #E3E5E8 */
  --card: 220 10% 20%;             /* HSL for #2E3133 */
  --card-foreground: 220 10% 90%;  /* HSL for #E3E5E8 */
  --popover: 220 10% 10%;          /* HSL for #17191A */
  --popover-foreground: 220 10% 90%; /* HSL for #E3E5E8 */
  --primary: 220 10% 65%;          /* HSL for #9EA1A3 */
  --primary-foreground: 220 10% 10%; /* HSL for #17191A */
  --secondary: 220 10% 25%;        /* HSL for #3A3D40 */
  --secondary-foreground: 220 10% 90%; /* HSL for #E3E5E8 */
  --muted: 220 10% 30%;            /* HSL for #474A4D */
  --muted-foreground: 220 10% 60%; /* HSL for #919496 */
  --accent: 220 10% 80%;           /* HSL for #C9CCCF */
  --accent-foreground: 220 10% 10%; /* HSL for #17191A */
  --destructive: 0 70% 50%;        /* HSL for #D92B2B */
  --destructive-foreground: 0 0% 98%; /* HSL for #FAFAFA */
  --border: 220 10% 35%;           /* HSL for #515457 */
  --input: 220 10% 28%;            /* HSL for #424547 */
  --ring: 220 10% 65%;             /* HSL for #9EA1A3 */
}
```

**Sidebar-Specific Colors (Default Theme)**
```css
:root {
  --sidebar-background: 240 25% 15%;       /* HSL for #1C2133 */
  --sidebar-foreground: 240 15% 80%;       /* HSL for #C6CCDE */
  --sidebar-primary: 240 65% 60%;          /* HSL for #6173D6 */
  --sidebar-primary-foreground: 240 60% 95%; /* HSL for #E8ECFB */
  --sidebar-accent: 240 30% 25%;          /* HSL for #2D3A59 */
  --sidebar-accent-foreground: 240 15% 85%; /* HSL for #D2D6E6 */
  --sidebar-border: 240 25% 22%;          /* HSL for #282E47 */
  --sidebar-ring: 240 65% 65%;            /* HSL for #7685E0 */
}
```

**Sidebar-Specific Colors (Dark Theme)**
```css
.dark {
  --sidebar-background: 220 10% 12%;       /* HSL for #1D1F21 */
  --sidebar-foreground: 220 10% 90%;       /* HSL for #E3E5E8 */
  --sidebar-primary: 220 10% 70%;          /* HSL for #ADAFB3 */
  --sidebar-primary-foreground: 220 10% 10%; /* HSL for #17191A */
  --sidebar-accent: 220 10% 25%;          /* HSL for #3A3D40 */
  --sidebar-accent-foreground: 220 10% 90%; /* HSL for #E3E5E8 */
  --sidebar-border: 220 10% 30%;          /* HSL for #474A4D */
  --sidebar-ring: 220 10% 70%;            /* HSL for #ADAFB3 */
}
```

## Part 3: Step-by-Step Component Recreation

This section breaks down every single component, starting with the highest-level layouts and pages.

### 3.1 — Root Layout

**File**: `src/app/layout.tsx`

**Purpose**: This is the root layout for the entire application. It sets up the `<html>` and `<body>` tags, includes the Toaster component for notifications, and links the necessary Google Fonts.

**DOM Structure & Styling**:

```html
<html lang="hi" suppressHydrationWarning>
  <head>
    <!-- Google Fonts Links -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <!-- Font: Inter (Weights: 400, 500, 600, 700) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <!-- Font: Poppins (Weights: 400, 500, 600, 700, 800, 900) -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <!-- Font: Noto Sans Devanagari (Weights: 400, 500, 600, 700) -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>

  <body class="font-body antialiased">
    <!-- {children} (Page content is rendered here) -->
    <!-- <Toaster /> (Renders notifications) -->
  </body>
</html>
```

**Styling Details**:
- `<html>`:
  - `lang="hi"`: Sets the primary language to Hindi.
  - `suppressHydrationWarning`: Prevents React warnings related to server/client rendering differences, often used with theme switching.
- `<body>`:
  - `font-body`: Applies the 'body' font family from `tailwind.config.ts` (`['Noto Sans Devanagari', 'Inter', 'sans-serif']`).
  - `antialiased`: Applies `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` for smoother font rendering.
  - The `bg-background` and `text-foreground` classes are applied globally in `globals.css`, setting the default background and text colors.

### 3.2 — Home Page

**File**: `src/app/page.tsx`

**Purpose**: The main landing page of the website. It fetches all articles and displays them in a grid.

**Parent Container**: The `HomePage` component is rendered inside the `{children}` of `AppLayout`.

**DOM Structure & Styling**:

```html
<!-- Component: AppLayout -->
<main>
  <section aria-labelledby="latest-articles-title" class="mb-12">
    <!-- This heading is commented out in the code, but if active: -->
    <!-- <h1 id="latest-articles-title" class="text-3xl md:text-4xl font-headline font-bold mb-8 pb-2 border-b-2 border-primary"> -->

    <!-- Conditional Rendering Logic: -->
    <!-- if (articles.length > 0) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loop through articles and render ArticleCard for each -->
      <!-- <ArticleCard key={article.id} article={article} /> -->
    </div>
    <!-- else -->
    <p class="text-center text-lg text-muted-foreground py-10">
      फिलहाल कोई लेख उपलब्ध नहीं है। कृपया बाद में जांचें।
    </p>
  </section>
</main>
```

**Styling Details**:
- `<section>`:
  - `mb-12`: `margin-bottom: 3rem;`
- `<div>` (Grid Container):
  - `grid`: `display: grid;`
  - `grid-cols-1`: `grid-template-columns: repeat(1, minmax(0, 1fr));` (Mobile default)
  - `md:grid-cols-2`: At the `md` breakpoint (768px and up), `grid-template-columns: repeat(2, minmax(0, 1fr));`
  - `lg:grid-cols-3`: At the `lg` breakpoint (1024px and up), `grid-template-columns: repeat(3, minmax(0, 1fr));`
  - `gap-6`: `gap: 1.5rem;` between grid items.
- `<p>` (Empty State):
  - `text-center`: `text-align: center;`
  - `text-lg`: `font-size: 1.125rem;`
  - `text-muted-foreground`: `color: hsl(var(--muted-foreground));`
  - `py-10`: `padding-top: 2.5rem; padding-bottom: 2.5rem;`

### 3.3 — App Layout Component

**File**: `src/components/layout/app-layout.tsx`

**Purpose**: The primary layout component that wraps the main content of every page, providing a consistent structure including the Navbar and Footer.

**DOM Structure & Styling**:

```html
<div class="flex flex-col min-h-screen">
  <!-- <Navbar /> -->
  <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- {children} (Page content, e.g., HomePage, is rendered here) -->
  </main>
  <!-- <Footer /> -->
</div>
```

**Styling Details**:
- Root `<div>`:
  - `flex`: `display: flex;`
  - `flex-col`: `flex-direction: column;`
  - `min-h-screen`: `min-height: 100vh;` This ensures the footer sticks to the bottom of the viewport even on pages with little content.
- `<main>`:
  - `flex-grow`: `flex-grow: 1;` This makes the main content area expand to fill the available space, pushing the footer down.
  - `container`: Applies the container styles from `tailwind.config.ts` (centered, padded, max-width).
  - `mx-auto`: `margin-left: auto; margin-right: auto;`
  - `px-4`: `padding-left: 1rem; padding-right: 1rem;`
  - `sm:px-6`: At `sm` breakpoint (640px+), `padding-left: 1.5rem; padding-right: 1.5rem;`
  - `lg:px-8`: At `lg` breakpoint (1024px+), `padding-left: 2rem; padding-right: 2rem;`
  - `py-8`: `padding-top: 2rem; padding-bottom: 2rem;`

### 3.4 — Navbar Component

**File**: `src/components/layout/navbar.tsx`

**Purpose**: The main site navigation bar, which is fixed to the top of the viewport. It contains the logo, a hamburger menu for mobile, and the primary category navigation for desktop.

**DOM Structure & Styling**:

```html
<header class="bg-black text-white shadow-md sticky top-0 z-50">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Left Section -->
      <div class="flex items-center">
        <!-- <HamburgerMenu /> -->
        <a href="/" class="flex items-center ml-2 px-2 py-1 rounded-md hover:bg-gray-700/50 transition-colors" aria-label="मुखपृष्ठ">
          <h1 class="text-xl md:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-cover bg-center" style="background-image: url('https://placehold.co/300x75.png')">
            NNP
          </h1>
        </a>
      </div>

      <!-- Center Section: Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-1 lg:space-x-1 xl:space-x-2 absolute left-1/2 transform -translate-x-1/2">
        <!-- Loop through CATEGORIES and render links -->
        <a href="/category/..." class="px-2 py-2 lg:px-3 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ...">
          Category Name
        </a>
      </nav>
      
      <!-- Right Section: Spacer to balance the layout -->
      <div class="w-auto invisible flex items-center" aria-hidden="true">
        <!-- The content here is a duplicate of the left section but invisible, ensuring the center nav is perfectly centered -->
        <!-- <HamburgerMenu /> -->
        <a href="/" class="flex items-center ml-2 px-2 py-1">
          <h1 class="text-xl md:text-2xl font-bold tracking-wider">NNP</h1>
        </a>
      </div>

    </div>
  </div>
</header>
```

**Styling Details**:
- `<header>`:
  - `bg-black`: `background-color: #000;`
  - `text-white`: `color: #fff;`
  - `shadow-md`: `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);`
  - `sticky`: `position: sticky;`
  - `top-0`: `top: 0;`
  - `z-50`: `z-index: 50;`
- Main `<div>` (`h-16`):
  - `flex`, `items-center`, `justify-between`: Creates the three-column (left, center, right) layout.
  - `h-16`: `height: 4rem;`
- Logo `<h1>`:
  - `text-xl md:text-2xl`: Font size is `1.25rem` on mobile, `1.5rem` on `md` screens+.
  - `font-bold`: `font-weight: 700;`
  - `tracking-wider`: `letter-spacing: 0.05em;`
  - `bg-clip-text text-transparent...`: These classes create a gradient/image-filled text effect. The text color is transparent, and the background image is clipped to the shape of the text.
- Center `<nav>`:
  - `hidden lg:flex`: The nav is hidden by default (`display: none;`) and becomes a flex container (`display: flex;`) on `lg` screens (1024px+).
  - `absolute left-1/2 transform -translate-x-1/2`: This is the standard CSS technique for absolute centering.
- Navigation Links `<a>`:
  - `px-2 py-2 lg:px-3`: `padding: 0.5rem 0.5rem;` on mobile, `padding: 0.5rem 0.75rem` on `lg` screens+.
  - `rounded-md`: `border-radius: 0.375rem;`
  - `text-xs lg:text-sm`: Font size is `0.75rem` on mobile, `0.875rem` on `lg` screens+.
  - `font-medium`: `font-weight: 500;`
  - `transition-colors`: For smooth hover/active state changes.
  - **Active State** (based on `pathname`): `bg-gray-700 text-white shadow-sm font-semibold`
  - **Inactive State**: `text-gray-300 hover:bg-gray-700 hover:text-white`

### 3.5 — Hamburger Menu Component

**File**: `src/components/layout/hamburger-menu.tsx`

**Purpose**: Provides the mobile navigation trigger. On mobile devices, a traditional navigation bar is too cluttered. This component displays a "hamburger" icon (three horizontal lines). When tapped, it opens a slide-out panel from the left side of the screen, commonly referred to as a **sidebar**. This sidebar, implemented using a `Sheet` component, contains the primary navigation links, a search bar, and other key actions, providing a clean user experience on smaller viewports.

**Parent Container**: Rendered inside the "Left Section" `div` of the `Navbar`.

**Component Dependencies**:
- `useState` from React
- `Button` from `@/components/ui/button`
- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` from `@/components/ui/sheet`
- `Menu` icon from `lucide-react`
- `SidebarNav` from `./sidebar-nav`

**DOM Structure & Styling (when rendered)**:

This component is a wrapper around the `Sheet` component from `shadcn/ui`.

1.  **Trigger Element**:
    ```html
    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-white hover:bg-gray-700 h-7 w-7 md:h-8 md:w-8" aria-label="नेविगेशन और खोज मेनू खोलें">
      <svg> <!-- Menu icon --> </svg>
    </button>
    ```
    **Styling Details**:
    - The base classes are from the `Button` component with `variant="ghost"`.
    - `text-white hover:bg-gray-700`: Overrides for this specific usage.
    - `h-7 w-7 md:h-8 md:w-8`: Size is `1.75rem` on mobile, `2rem` on `md` screens+.

2.  **Sheet Content (when open)**:
    ```html
    <div class="fixed inset-0 z-50 bg-black/80"></div> <!-- Overlay -->
    <div class="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out ... inset-y-0 left-0 h-full w-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm max-w-xs p-0 bg-sidebar text-sidebar-foreground flex flex-col">
      <div class="p-4 border-b border-sidebar-border">
        <h2 class="font-semibold text-lg tracking-tight font-headline text-xl text-primary">मेनू</h2>
      </div>
      <!-- <SidebarNav /> is rendered here -->
    </div>
    ```
    **Styling Details**:
    - `side="left"`: The sheet slides in from the left.
    - `w-full max-w-xs sm:max-w-sm`: `max-width: 20rem;` on mobile, `22rem` on `sm` screens+.
    - `p-0`: Removes default padding to allow for custom header/content structure.
    - `bg-sidebar text-sidebar-foreground`: Uses the specific sidebar theme colors.
    - `flex flex-col`: Allows the `SidebarNav` to grow and fill the available space.
    - **Header**:
      - `p-4`: `padding: 1rem;`
      - `border-b border-sidebar-border`: A bottom border using the sidebar's border color.
    - **Title (`SheetTitle`)**:
      - `font-headline text-xl text-primary`: Uses "Poppins" font, `1.25rem` size, and the primary theme color.

### 3.6 — Article Card Component

**File**: `src/components/news/article-card.tsx`

**Purpose**: This is the most critical display component for news items, used on the home page, category pages, and search results. It displays a preview of an article.

**Parent Container**: This component is rendered inside the `div` with the class `grid`. The `grid` container is a child of the `section` in `HomePage`. The `ArticleCard` itself becomes a grid item.

**DOM Structure & Styling**:

```html
<div class="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-border">
  <a href="/article/{article.id}" aria-label="{article.title} के बारे में और पढ़ें" class="flex flex-col h-full group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">

    <!-- CardHeader -->
    <div class="p-0">
      <div class="relative w-full h-48">
        <img src="{article.imageUrl}" class="transition-transform duration-300 group-hover:scale-105 object-cover" style="position: absolute; height: 100%; width: 100%; left: 0; top: 0; right: 0; bottom: 0; color: transparent;">
      </div>
    </div>

    <!-- CardContent -->
    <div class="p-4 flex-grow">
      <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-2 bg-primary/10 text-primary border-primary/20 hidden">
        {article.categoryName}
      </div>
      <h3 class="font-semibold leading-none tracking-tight font-headline text-lg md:text-xl leading-tight mb-2 text-white group-hover:text-primary transition-colors">
        {article.title}
      </h3>
    </div>

    <!-- CardFooter -->
    <div class="p-4 pt-0 flex flex-col sm:flex-row justify-start items-start sm:items-center">
      <div class="text-xs text-card-foreground flex items-center">
        <svg class="h-4 w-4 mr-1"> <!-- CalendarDays icon --> </svg>
        {publishedDate}
      </div>
    </div>

  </a>
</div>
```

**Contextual Sizing & Positioning**:
- **Width**: The width of the `ArticleCard` is not defined on the component itself. It is determined by the parent `grid` container.
  - On mobile (`grid-cols-1`), its width is `100%` of the content area minus grid gap.
  - On `md` screens (`grid-cols-2`), its width is `~50%` of the content area minus grid gap.
  - On `lg` screens (`grid-cols-3`), its width is `~33.3%` of the content area minus grid gap.
- **Height**: The card is designed to fill the height of its grid cell.
  - The root `div` and the `<a>` tag both have `h-full` (`height: 100%;`), making them stretch to the height of the tallest card in their row.
  - `flex-col` on both elements ensures the content stacks vertically.
  - `flex-grow` on the `CardContent` (`p-4` div) is the key to this behavior. It makes the content area expand to fill any remaining vertical space, pushing the `CardFooter` to the bottom. This ensures all cards in a row have a uniform appearance regardless of title length.

**Styling Details**:
- Root `<div>`:
  - `h-full`: `height: 100%`
  - `overflow-hidden`: `overflow: hidden;` (Clips the hover-scaled image).
  - `shadow-lg`: `box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);`
  - `hover:shadow-xl`: Increases the shadow size on hover.
  - `transition-shadow duration-300`: Smoothly animates the shadow change.
  - `rounded-lg`: `border-radius: 0.5rem;` (maps to `--radius`).
  - `border`: Adds a 1px border using `border-color: hsl(var(--border));`
- Image `<div>`:
  - `relative`: `position: relative;` (Creates a positioning context for the `Image`).
  - `h-48`: `height: 12rem;` (This gives the image a fixed height).
- Image `<img>`:
  - `group-hover:scale-105`: When the parent `<a>` (which has the `group` class) is hovered, the image scales up to 105%.
  - `object-cover`: The image will cover the entire `h-48` container, potentially being cropped to fit.
- `CardTitle` `<h3>`:
  - `group-hover:text-primary`: When hovering the card, the title text color changes to the primary theme color.
- `CardFooter` `<div>`:
  - `pt-0`: `padding-top: 0;` (Removes the top padding from the footer).
  - `flex-col sm:flex-row`: Stacks items vertically on mobile, horizontally on `sm` screens+.
  - `justify-start`: `justify-content: flex-start;`
  - `items-start sm:items-center`: Aligns items to the top on mobile, centers them vertically on `sm` screens+.

### 3.7 — Sidebar Navigation Component

**File**: `src/components/layout/sidebar-nav.tsx`

**Purpose**: This component renders the primary navigation links inside the mobile menu's `Sheet`. It includes a search bar, a list of all categories, and a prominent link to the admin panel.

**Parent Container**: Rendered inside the `SheetContent` of the `HamburgerMenu` component.

**Component Dependencies**:
- `Link` from `next/link`
- `usePathname` from `next/navigation`
- `NAV_ITEMS` from `@/lib/placeholder-data`
- `cn` utility from `@/lib/utils`
- `NavItem` type from `@/lib/types`
- `SearchBar` from `../search-bar`

**Props**:
```typescript
interface SidebarNavProps {
  onLinkClick?: () => void; // Optional function to close the sheet on link click
}
```

**DOM Structure & Styling**:

```html
<nav class="flex flex-col flex-grow">
  
  <!-- Search Bar Section -->
  <div class="p-4">
    <!-- <SearchBar /> Component is rendered here -->
  </div>

  <!-- Main Navigation Links -->
  <div class="p-4 space-y-1 flex-grow overflow-y-auto">
    <!-- Loop through `regularNavItems` (all items except /admin) -->
    <a href="{item.href}" class="flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ...">
      <svg class="h-5 w-5"> <!-- item.icon --> </svg>
      <span class="font-headline">{item.label}</span>
    </a>
  </div>

  <!-- Admin Panel Link Section -->
  <div class="mt-auto p-4 border-t-2 border-sidebar-border/70 flex justify-center">
    <a href="/admin" class="flex items-center space-x-3 px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-md w-auto ...">
      <svg class="h-6 w-6 text-white"> <!-- adminItem.icon --> </svg>
      <span class="font-headline">एडमिन पैनल</span>
    </a>
  </div>
</nav>
```

**Styling Details**:
- Root `<nav>`:
  - `flex flex-col`: Stacks the three sections (Search, Links, Admin) vertically.
  - `flex-grow`: Ensures the `nav` element fills the entire height of its parent `SheetContent`.
- Search Bar `<div>`:
  - `p-4`: `padding: 1rem;`
- Main Links `<div>`:
  - `p-4`: `padding: 1rem;`
  - `space-y-1`: Adds `margin-top: 0.25rem;` between the link elements.
  - `overflow-y-auto`: If the list of categories is very long, it will become scrollable.
- **Regular Navigation Link `<a>`**:
  - `flex items-center`: Aligns icon and text horizontally.
  - `space-x-3`: `margin-left: 0.75rem;` between the icon and the text.
  - `px-3 py-2.5`: `padding-left/right: 0.75rem;`, `padding-top/bottom: 0.625rem;`
  - `rounded-md`: `border-radius: 0.375rem;`
  - `text-base font-medium`: `font-size: 1rem;`, `font-weight: 500;`
  - `transition-colors`: For smooth hover/active state changes.
  - **Active State** (when `pathname === item.href`):
    - `bg-sidebar-primary`: `background-color: hsl(var(--sidebar-primary));`
    - `text-sidebar-primary-foreground`: `color: hsl(var(--sidebar-primary-foreground));`
  - **Inactive State**:
    - `text-sidebar-foreground`: `color: hsl(var(--sidebar-foreground));`
    - `hover:bg-sidebar-accent`: Hover background color.
    - `hover:text-sidebar-accent-foreground`: Hover text color.
  - **Focus State**:
    - `focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 ...`: Provides a clear focus indicator for accessibility.
- Admin Link Section `<div>`:
  - `mt-auto`: `margin-top: auto;` This pushes the section to the bottom of the flex container.
  - `p-4`: `padding: 1rem;`
  - `border-t-2 border-sidebar-border/70`: A `2px` top border with 70% opacity.
  - `flex justify-center`: Centers the admin button horizontally.
- **Admin Link `<a>`**:
  - This link is styled to look more like a primary action button.
  - `px-6 py-3`: Large padding (`1.5rem` horizontal, `0.75rem` vertical).
  - `rounded-lg`: `border-radius: 0.5rem;`
  - `font-semibold`: `font-weight: 600;`
  - `shadow-md`: Adds a distinct shadow.
  - `w-auto`: `width: auto;` so it only takes up as much space as its content.
  - **Active State**: `bg-blue-700 text-white`
  - **Inactive State**: `bg-blue-600 text-white hover:bg-blue-700` (Uses hardcoded blue colors instead of theme variables for emphasis).

### 3.8 — Search Bar Component

**File**: `src/components/search-bar.tsx`

**Purpose**: A simple form component that allows users to enter a search query. It captures the query and navigates to the search results page.

**Parent Container**: Rendered inside the `SidebarNav` component.

**Component Dependencies**:
- `useState` from React
- `useRouter` from `next/navigation`
- `Input` from `@/components/ui/input`
- `Button` from `@/components/ui/button`
- `Search` icon from `lucide-react`

**DOM Structure & Styling**:

```html
<form class="relative">
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <!-- Search Icon -->
  </svg>
  <input type="search" placeholder="लेख खोजें..." class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10">
</form>
```

**Styling Details**:
- `<form>`:
  - `relative`: `position: relative;` This is the positioning context for the search icon.
- Search Icon `<svg>`:
  - `absolute`: `position: absolute;`
  - `left-3`: `left: 0.75rem;`
  - `top-1/2`: `top: 50%;`
  - `-translate-y-1/2`: `transform: translateY(-50%);` (This combination perfectly centers the icon vertically).
  - `h-5 w-5`: `height: 1.25rem; width: 1.25rem;`
  - `text-gray-400`: Sets the icon color.
- `<input>`:
  - The base classes are from the `Input` shadcn/ui component.
  - `pl-10`: `padding-left: 2.5rem;` This is the key styling. It adds enough left padding to the input field so that the typed text does not overlap with the absolutely positioned icon.

## Detailed Component Specifications

### Article Card
- Height: Full container height
- Image: 48px height, object-fit: cover
- Border radius: Matching global radius (0.5rem)
- Shadow: lg (tailwind shadow-lg)
- Hover effect: Increased shadow (shadow-xl)
- Image hover: Scale 1.05 with smooth transition
- Title hover: Changes to primary color

### Hamburger Menu Button
- Size: 7px (mobile), 8px (desktop)
- Position: Top left of navbar
- Icon: Lucide Menu icon
- Hover: Gray background (bg-gray-700)

### Admin Login Form
- Width: 100% with max-width of md (28rem)
- Shadow: 2xl (extra large shadow)
- Background: Card background
- Input height: Tall enough for comfortable touch (text-base class)
- Button: Full width with large text (text-lg)
- Loading indicator: Animated spinner when submitting

### Navigation Links
- Padding: px-3 py-2.5 (desktop), adjusted for mobile
- Border radius: Matching global radius
- Active state: Background color matching sidebar-primary
- Hover state: Background color matching sidebar-accent

## Implementation Notes

This documentation is based on the current codebase analysis and may need updates as the project evolves. For the most accurate information, always refer to the actual code.

The design system uses CSS variables for theming, allowing easy customization and potential theme switching. The Tailwind configuration extends these theme variables.

Firebase is used as the backend, providing authentication and database services without requiring a separate server setup.

The admin panel is designed for content managers to easily add and update articles, with a simple interface that doesn't require technical knowledge.

## Part 4: Page-Level Component Recreation

This section details the components that define the primary views or pages of the application, such as the login screen, category pages, and the main admin interface.

### 4.1 — Login Page

**File**: `src/app/login/page.tsx`

**Purpose**: Provides the user interface for administrators to log in. It handles user input, communicates with Firebase Authentication, displays loading and error states, and redirects upon successful login.

**Parent Container**: This component is a top-level page and is rendered as the `{children}` within the root `src/app/layout.tsx`. It does not use the standard `AppLayout`.

**Component Dependencies**:
- `useState`, `useEffect` from React
- `useRouter` from `next/navigation`
- `signInWithEmailAndPassword`, `onAuthStateChanged` from `firebase/auth`
- `auth` from `@/lib/firebase`
- `Button` from `@/components/ui/button`
- `Input` from `@/components/ui/input`
- `Label` from `@/components/ui/label`
- `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` from `@/components/ui/card`
- `useToast` from `@/hooks/use-toast`
- `Loader2`, `LogIn` icons from `lucide-react`

**Conditional Rendering States**:

1.  **Authentication Check State**: While checking if a user is already logged in, a full-screen loader is displayed.
    ```html
    <div class="flex items-center justify-center min-h-screen bg-background">
      <svg class="h-12 w-12 animate-spin text-primary"> <!-- Loader2 icon --></svg>
    </div>
    ```
2.  **Main Login Form State**: If the user is not logged in, the main form is rendered.

**DOM Structure & Styling (Main Form)**:

```html
<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
  <div class="border bg-card text-card-foreground rounded-lg shadow-2xl w-full max-w-md">
    
    <!-- CardHeader -->
    <div class="flex flex-col space-y-1.5 p-6 text-center">
      <h3 class="font-semibold leading-none tracking-tight text-3xl font-bold flex items-center justify-center">
        <svg class="h-8 w-8 mr-2 text-primary"> <!-- LogIn icon --></svg>
        Admin Login
      </h3>
      <p class="text-sm text-muted-foreground">Access your application's control panel.</p>
    </div>

    <!-- Form -->
    <form>
      <!-- CardContent -->
      <div class="p-6 pt-0 space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">Email Address</label>
          <input id="email" type="email" placeholder="admin@example.com" class="... text-base" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none ..." for="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" class="... text-base" />
        </div>
        
        <!-- Error Message (Conditional) -->
        <p class="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{error}</p>
      </div>

      <!-- CardFooter -->
      <div class="flex flex-col items-center p-6 pt-0">
        <button type="submit" class="... w-full text-lg py-6" disabled={isLoading}>
          <!-- Conditional Content -->
          <!-- if isLoading -->
          <svg class="mr-2 h-5 w-5 animate-spin"> <!-- Loader2 icon --></svg>
          Signing In...
          <!-- else -->
          Sign In
        </button>
      </div>
    </form>

  </div>
</div>
```

**Styling Details**:
- **Page Wrapper `<div>`**:
  - `flex items-center justify-center`: Centers the `Card` component both horizontally and vertically.
  - `min-h-screen`: `min-height: 100vh;`
  - `bg-gradient-to-br from-slate-900 to-slate-800`: Creates a dark slate gradient background.
  - `p-4`: `padding: 1rem;`
- **Card `<div>`**:
  - `rounded-lg`: `border-radius: 0.5rem`
  - `shadow-2xl`: `box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);`
  - `w-full max-w-md`: The card takes the full width of its container, but is capped at a `max-width` of `28rem`.
- **Card Title `<h3>`**:
  - `text-3xl`: `font-size: 1.875rem;`
  - `font-bold`: `font-weight: 700;`
  - `flex items-center justify-center`: Aligns the icon and text.
- **Icon `<svg>`**:
  - `h-8 w-8`: `height: 2rem; width: 2rem;`
  - `mr-2`: `margin-right: 0.5rem;`
  - `text-primary`: `color: hsl(var(--primary));`
- **Inputs `<input>`**:
  - Base classes from the `Input` component.
  - `text-base`: `font-size: 1rem;` (Overrides the default smaller size for better readability on a login form).
- **Error `<p>`**:
  - `text-sm text-destructive`: `font-size: 0.875rem;`, `color: hsl(var(--destructive));`
  - `bg-destructive/10`: The background is the destructive color with 10% opacity.
  - `p-2 rounded-md`: `padding: 0.5rem;`, `border-radius: 0.375rem;`
- **Submit Button `<button>`**:
  - `w-full`: `width: 100%;`
  - `text-lg`: `font-size: 1.125rem;`
  - `py-6`: `padding-top: 1.5rem; padding-bottom: 1.5rem;` (A very tall button for emphasis).
  - **Loading State**:
    - `disabled={isLoading}`: The button is disabled during submission.
    - `mr-2 h-5 w-5 animate-spin`: A spinning `Loader2` icon is displayed next to the "Signing In..." text.

### 4.2 — Admin Page

**File**: `src/app/admin/page.tsx`

**Purpose**: This is the central hub for all administrative tasks. It's a client-rendered, stateful component that allows for adding new articles (via form or JSON), and managing the database paths that the application uses for content.

**Parent Container**: Rendered as the `{children}` within `AppLayout`.

**Component Dependencies**:
- React hooks: `useState`, `useEffect`, `useCallback`
- Next.js: `useRouter`
- Firebase: `onAuthStateChanged`, `signOut`, `ref`, `set`, `push`, `onValue`, `off`
- Local Components: `AppLayout`, `Button`, `Input`, `Label`, `Textarea`, `Card`, `Tabs`, `AlertDialog`, `Dialog`, `Select`, and more from `shadcn/ui`.
- Icons: A large number of icons from `lucide-react`.
- Types: `Article` from `@/lib/types`.

**High-Level Structure**:
The page is built around a `Tabs` component that separates the main functionalities.

```html
<AppLayout>
  <Tabs defaultValue="add-article">
    
    <!-- Tab Triggers -->
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="add-article">...</TabsTrigger>
      <TabsTrigger value="manage-data">...</TabsTrigger>
    </TabsList>

    <!-- Tab Content: Add Article -->
    <TabsContent value="add-article">
      <Card>
        <CardHeader>...</CardHeader>
        <CardContent>
          <!-- Article Creation Form -->
        </CardContent>
      </Card>
    </TabsContent>

    <!-- Tab Content: Manage Data -->
    <TabsContent value="manage-data">
      <!-- JSON Upload Card -->
      <!-- Database Path Management Card -->
      <!-- Data Structure Info Card -->
    </TabsContent>

  </Tabs>
</AppLayout>
```

**Styling Details for Tabs**:
- `<TabsList>`:
  - `grid w-full grid-cols-2`: Creates a full-width, two-column grid, making each tab trigger take up 50% of the width.

---

#### 4.2.1 - "Add Article" Tab

This is the default tab, containing a form to manually add a single news article.

**DOM Structure & Styling**:

```html
<div class="border bg-card text-card-foreground rounded-lg"> <!-- Card -->
  <div class="flex flex-col space-y-1.5 p-6"> <!-- CardHeader -->
    <h3 class="font-semibold leading-none tracking-tight flex items-center text-lg">
      <svg class="h-5 w-5 mr-2"> <!-- FileText icon --> </svg>
      Add Article via Form
    </h3>
    <p class="text-sm text-muted-foreground">
      Create a single article by filling out the fields below.
    </p>
  </div>
  <div class="p-6 pt-0"> <!-- CardContent -->
    <form class="space-y-6">
      <!-- Form Row 1: Title -->
      <div class="space-y-2">
        <label for="title">Title</label>
        <input id="title" name="title" placeholder="Article Title" />
      </div>

      <!-- Form Row 2: Category Slug -->
      <div class="space-y-2">
        <label for="categorySlug">Category Slug</label>
        <input id="categorySlug" name="categorySlug" placeholder="e.g., 'politics' or 'sports'" />
        <!-- Note: This could be a <Select> dropdown for better UX -->
      </div>
      
      <!-- Form Row 3: Summary -->
      <div class="space-y-2">
        <label for="summary">Summary</label>
        <textarea id="summary" name="summary" placeholder="A short summary of the article..."></textarea>
      </div>

      <!-- Form Row 4: Full Content -->
      <div class="space-y-2">
        <label for="content">Full Content</label>
        <textarea id="content" name="content" placeholder="The full content of the article, in Markdown or HTML..." class="h-48"></textarea>
      </div>

      <!-- Form Row 5 & 6: Image URL and Author -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" />
        </div>
        <div class="space-y-2">
          <label for="author">Author</label>
          <input id="author" name="author" placeholder="Author's Name" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button type="submit" class="inline-flex items-center ...">
          <svg class="h-4 w-4 mr-2"> <!-- Save icon --> </svg>
          Save Article
        </button>
      </div>
    </form>
  </div>
</div>
```

**Styling Details**:
- **Form Layout**:
  - The form uses `space-y-6` (`margin-top: 1.5rem;` between children) to space out the rows.
  - Each form row uses `space-y-2` (`margin-top: 0.5rem;`) to space the `label` and `input`.
- **Two-Column Row**:
  - `grid grid-cols-1 md:grid-cols-2 gap-6`: Stacks the Image URL and Author fields on mobile, and places them in a two-column grid on `md` screens+. `gap-6` adds space between the columns.
- **Textarea Height**:
  - The "Full Content" textarea has an explicit height class: `h-48` (`height: 12rem;`).
- **Submit Button**:
  - `flex justify-end`: Aligns the button to the right side of its container.

---

#### 4.2.2 - "Manage Data" Tab - JSON Upload

This section allows for bulk data uploads by pasting JSON content.

**DOM Structure & Styling**:

```html
<!-- This content is inside the value="manage-data" TabsContent -->
<div class="border bg-card text-card-foreground rounded-lg mb-6"> <!-- Card -->
  <div class="flex flex-col space-y-1.5 p-6"> <!-- CardHeader -->
    <h3 class="font-semibold ... flex items-center text-lg">
      <svg class="h-5 w-5 mr-2"> <!-- UploadCloud icon --> </svg>
      Upload Full JSON
    </h3>
    <p class="text-sm text-muted-foreground">
      Paste a complete JSON structure to overwrite the data at the selected database path.
    </p>
  </div>
  <div class="p-6 pt-0"> <!-- CardContent -->
    <form>
      <div class="grid w-full gap-4">
        <!-- Database Path Selector -->
        <div class="space-y-2">
          <label>Target Database Path</label>
          <select>...</select> <!-- A <Select> component is used here -->
        </div>

        <!-- JSON Input -->
        <div class="space-y-2">
          <label for="jsonInput">JSON Data</label>
          <textarea id="jsonInput" placeholder='{ "key": "value", ... }' class="h-60 font-mono text-sm"></textarea>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button type="submit" class="... bg-primary/90 hover:bg-primary">
            <svg class="h-4 w-4 mr-2"> <!-- Upload icon --> </svg>
            Upload JSON
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
```

**Styling Details**:
- **Card Margin**:
  - `mb-6`: `margin-bottom: 1.5rem;` to create space between this card and the next one (DB Path Management).
- **Form Grid**:
  - `grid w-full gap-4`: The form content is laid out in a single-column grid with `1rem` of space between rows.
- **JSON Textarea**:
  - `h-60`: A large fixed height of `15rem`.
  - `font-mono`: Uses a monospace font for better readability of code/JSON.
  - `text-sm`: A smaller font size (`0.875rem`) suitable for code.

---

#### 4.2.3 - "Manage Data" Tab - Database Path Management

This section provides a powerful interface for administrators to view, add, edit, and delete the Firebase Realtime Database paths that the application uses for content uploads.

**DOM Structure & Styling**:

```html
<div class="border bg-card text-card-foreground rounded-lg"> <!-- Card -->
  <!-- CardHeader: Collapsible Trigger -->
  <div class="flex flex-col space-y-1.5 p-6">
    <button class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2"> <!-- Settings icon --> </svg>
        <h3 class="font-semibold ... text-lg">Manage Database Paths</h3>
      </div>
      <svg class="h-5 w-5 transition-transform"> <!-- ChevronDown/Up icon --> </svg>
    </button>
  </div>

  <!-- CardContent: Collapsible Content -->
  <div class="p-6 pt-0"> <!-- This div is conditionally rendered -->
    <div class="space-y-4">
      
      <!-- List of Existing Paths -->
      <div class="space-y-2">
        <label>Existing Paths</label>
        <!-- Loop through `dbPaths` -->
        <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50">
          <span class="text-sm font-mono truncate">{path}</span>
          <div class="flex items-center gap-1">
            <button class="..."> <!-- Edit Button with Edit icon --></button>
            <button class="..."> <!-- Delete Button with Trash2 icon --></button>
          </div>
        </div>
      </div>

      <!-- Add New Path Form -->
      <div class="space-y-2 pt-4 border-t">
        <label for="new-path">Add New Path</label>
        <div class="flex items-center gap-2">
          <input id="new-path" placeholder="e.g., 'users' or 'config/settings'" class="flex-grow" />
          <button class="...">
            <svg class="h-4 w-4 mr-2"> <!-- Plus icon --></svg>
            Add
          </button>
        </div>
      </div>
      
    </div>
  </div>
</div>
```

**Styling and Interaction Details**:
- **Collapsible Card**:
  - The `CardHeader` is a `<button>` that toggles the visibility of the `CardContent`.
  - The Chevron icon (`<svg>`) rotates based on the collapsed state (`transition-transform`).
- **Path List**:
  - Each path is displayed in its own `div` with a light background (`bg-muted/50`).
  - `justify-between`: Pushes the path name to the left and the action buttons to the right.
  - `gap-2`: Adds `0.5rem` of space between the path name and the buttons.
  - `font-mono truncate`: The path is displayed in a monospace font and will be truncated with an ellipsis (`...`) if it's too long to fit.
- **Action Buttons (Edit/Delete)**:
  - These are small, icon-only buttons (`variant="ghost"`, `size="icon"`).
  - They have specific hover styles (`hover:bg-accent`, `hover:text-accent-foreground` for edit; `hover:bg-destructive`, `hover:text-destructive-foreground` for delete).
- **Add Path Form**:
  - `pt-4 border-t`: Separates this form from the list above with padding and a border.
  - `flex items-center gap-2`: Aligns the input field and "Add" button horizontally.
  - `flex-grow` on the `<input>` makes it take up all available horizontal space.

---

#### 4.2.4 - "Manage Data" Tab - Data Structure Information

This is a simple, collapsible, informational card at the bottom of the "Manage Data" tab that provides developers or admins with a quick reference for the expected JSON structure of an article.

**DOM Structure & Styling**:

```html
<div class="border bg-card text-card-foreground rounded-lg mt-6"> <!-- Card -->
  <!-- CardHeader: Collapsible Trigger -->
  <div class="flex flex-col space-y-1.5 p-6">
    <button class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2"> <!-- Info icon --> </svg>
        <h3 class="font-semibold ... text-lg">Data Structure Guide</h3>
      </div>
      <svg class="h-5 w-5 transition-transform"> <!-- ChevronDown/Up icon --> </svg>
    </button>
  </div>

  <!-- CardContent: Collapsible Content -->
  <div class="p-6 pt-0"> <!-- This div is conditionally rendered -->
    <p class="text-sm text-muted-foreground mb-4">
      The 'articles' path should contain an array of article objects. Here is the required structure for a single article:
    </p>
    <pre class="w-full rounded-md bg-muted p-4 font-mono text-sm overflow-x-auto">
      <code class="text-muted-foreground">
{
  "title": "...",
  "summary": "...",
  "content": "...",
  "imageUrl": "...",
  "categorySlug": "...",
  "author": "...",
  "publishedAt": "ISO 8601 Date String"
}
      </code>
    </pre>
  </div>
</div>
```

**Styling Details**:
- `mt-6`: `margin-top: 1.5rem;` to space it from the card above.
- **Code Block `<pre>`**:
  - `w-full`: `width: 100%;`
  - `rounded-md bg-muted p-4`: Styles the container with a muted background, padding, and rounded corners.
  - `font-mono text-sm`: Sets the font for the code block.
  - `overflow-x-auto`: Makes the block horizontally scrollable if the content is too wide.

### 5.2 — Category Page

**File**: `src/app/category/[slug]/page.tsx`

**Purpose**: Displays a list of all articles belonging to a specific category, identified by the `slug` in the URL.

**Parent Container**: Rendered as the `{children}` within `AppLayout`.

**DOM Structure & Styling**:

```html
<AppLayout>
  <!-- <CategoryNewsList articles={articles} categoryName={category.name} /> -->
</AppLayout>
```

---

#### 5.2.1 - Category News List Component

**File**: `src/components/news/category-news-list.tsx`

**Purpose**: Renders the main content for a category page, including the category title and a grid of `ArticleCard` components.

**DOM Structure & Styling**:

```html
<section aria-labelledby="category-{categoryName}-title">
  <!-- Category Title -->
  <h1 id="category-{categoryName}-title" class="text-3xl md:text-4xl font-headline font-bold mb-8 pb-2 border-b-2 border-primary">
    {categoryName}
  </h1>

  <!-- Conditional Rendering: if (articles.length > 0) -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Loop through articles and render <ArticleCard /> -->
  </div>
  
  <!-- Conditional Rendering: else -->
  <p>इस श्रेणी में कोई लेख नहीं मिला। कृपया बाद में जांचें।</p>
</section>
```

**Styling Details**:
- **Title `<h1>`**:
  - `text-3xl md:text-4xl`: `font-size: 1.875rem;` on mobile, `2.25rem` on `md` screens+.
  - `font-headline font-bold`: Uses "Poppins" font with `font-weight: 700;`.
  - `mb-8 pb-2`: `margin-bottom: 2rem;`, `padding-bottom: 0.5rem;`
  - `border-b-2 border-primary`: A `2px` bottom border using the primary theme color, creating a strong visual underline for the title.
- **Article Grid `<div>`**:
  - This `div` uses the exact same grid layout classes as the `HomePage` (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`), ensuring a consistent presentation of articles across the site.

### 5.3 — Search Page

**File**: `src/app/search/page.tsx`

**Purpose**: Displays the results of a user's search query. It retrieves the query from the URL's search parameters.

**Parent Container**: Rendered as the `{children}` within `AppLayout`.

**DOM Structure & Styling**:

```html
<AppLayout>
  <div class="max-w-4xl mx-auto">
    <!-- Search Title -->
    <h1 class="text-3xl md:text-4xl font-headline font-bold mb-8">
      Search Results for: <span class="text-primary">{searchQuery}</span>
    </h1>
    
    <!-- <SearchResultsList articles={articles} /> -->
  </div>
</AppLayout>
```
**Styling Details**:
- The outer `div` with `max-w-4xl mx-auto` constrains the content width, similar to the article detail page.
- The search query text (`{searchQuery}`) is highlighted using `text-primary`.

---

#### 5.3.1 - Search Results List Component

**File**: `src/components/news/search-results-list.tsx`

**Purpose**: Renders the list of found articles or an empty state message.

**DOM Structure & Styling**:

```html
<!-- Conditional Rendering: if (articles.length > 0) -->
<div class="space-y-8">
  <!-- Loop through articles and render... -->
  <a href="/article/{article.id}" class="flex flex-col md:flex-row items-start gap-6 group">
    <!-- Image -->
    <div class="relative w-full md:w-1/3 h-48 flex-shrink-0">
      <img src="{article.imageUrl}" class="rounded-lg object-cover" />
    </div>
    <!-- Text Content -->
    <div class="flex-grow">
      <h2 class="text-2xl font-bold font-headline mb-2 group-hover:text-primary">{article.title}</h2>
      <p class="text-muted-foreground leading-relaxed">{article.summary}</p>
    </div>
  </a>
</div>

<!-- Conditional Rendering: else -->
<div class="text-center py-20 border-t mt-8">
  <h3 class="text-xl font-semibold">No Results Found</h3>
  <p class="text-muted-foreground mt-2">Try searching for something else.</p>
</div>
```

**Styling Details**:
- **List Layout**:
  - `space-y-8`: Creates a large `margin-top: 2rem;` between each search result item.
- **Result Item `<a>`**:
  - `flex flex-col md:flex-row`: Stacks the image and text vertically on mobile, and places them side-by-side on `md` screens+.
  - `gap-6`: `gap: 1.5rem;`
- **Image Container `<div>`**:
  - `w-full md:w-1/3`: The image takes full width on mobile, but only one-third of the container width on `md` screens+.
  - `h-48`: A fixed height of `12rem`.
  - `flex-shrink-0`: Prevents the image container from shrinking when the title/summary text is long.
- **Text Container `<div>`**:
  - `flex-grow`: Allows this container to take up the remaining space (`2/3` of the width on `md` screens).
- **Title `<h2>`**:
  - `group-hover:text-primary`: The title color changes on hover of the parent link (`<a>`).

### 5.4 — Related Articles Component

**File**: `src/components/news/related-articles.tsx`

**Purpose**: Appears at the bottom of an `ArticleDetail` page, showing a list of other relevant articles.

**Conditional Rendering**: The component has three states: Loading, Error, and Success.

**DOM Structure & Styling (Success State)**:

```html
<div class="border bg-card text-card-foreground rounded-lg mt-8 shadow-lg"> <!-- Card -->
  <div class="flex flex-col space-y-1.5 p-6 pb-4"> <!-- CardHeader -->
    <h3 class="font-semibold ... font-headline text-2xl flex items-center">
      <svg class="h-7 w-7 mr-3 text-primary"> <!-- Lightbulb icon --> </svg>
      संबंधित लेख
    </h3>
  </div>
  <div class="p-6 pt-0"> <!-- CardContent -->
    <ul class="space-y-4">
      <!-- Loop through related articles -->
      <li>
        <a href="/article/{article.id}" class="block p-4 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
          <h4 class="font-bold font-headline mb-1">{article.title}</h4>
          <p class="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
        </a>
      </li>
    </ul>
  </div>
</div>
```

**Styling Details**:
- **List Item `<a>`**:
  - `block p-4`: The entire list item is a clickable block with `1rem` of padding.
  - `bg-muted/30 hover:bg-muted/60`: Has a subtle background color that becomes more opaque on hover.
- **Summary `<p>`**:
  - `line-clamp-2`: This utility class (often from a plugin) truncates the summary text to a maximum of two lines, followed by an ellipsis.

## Part 6: Auxiliary Components & Finalization

This final section covers the remaining components that support the primary views, such as the `Breadcrumb`, and provides a concluding summary.

### 6.1 — Breadcrumb Component

**File**: `src/components/layout/breadcrumb.tsx`

**Purpose**: Displays a breadcrumb navigation trail, typically at the top of a page, showing the user their current location in the site hierarchy (e.g., Home > Category > Article Title).

**Component Dependencies**:
- `Link` from `next/link`
- `Fragment` from `react`
- `ChevronRight` icon from `lucide-react`

**Props**:
```typescript
interface BreadcrumbProps {
  items: {
    label: string;
    href?: string; // Optional: The last item may not have a link
  }[];
}
```

**DOM Structure & Styling**:

```html
<nav aria-label="Breadcrumb">
  <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
    <!-- Loop through `items` -->
    <li>
      <div class="flex items-center">
        <!-- Conditional: if item has href -->
        <a href="{item.href}" class="hover:text-foreground hover:underline">{item.label}</a>
        <!-- else -->
        <span class="font-medium text-foreground">{item.label}</span>

        <!-- Conditional: if not the last item -->
        <svg class="h-4 w-4 mx-2 flex-shrink-0"> <!-- ChevronRight icon --> </svg>
      </div>
    </li>
  </ol>
</nav>
```

**Styling Details**:
- `<ol>`:
  - `flex items-center`: Aligns all breadcrumb items and separators horizontally.
  - `space-x-2`: Adds `0.5rem` of margin between each `<li>` element.
  - `text-sm text-muted-foreground`: Sets the default small, muted text style for the breadcrumbs.
- **Linked Item `<a>`**:
  - `hover:text-foreground hover:underline`: On hover, the link becomes brighter and underlined for clear affordance.
- **Current Page Item `<span>`**:
  - `font-medium text-foreground`: The last item in the breadcrumb (the current page) is styled to be more prominent with a heavier font weight and brighter text color.
- **Separator `<svg>`**:
  - `mx-2`: `margin-left: 0.5rem; margin-right: 0.5rem;` to provide space around the chevron icon.
  - `flex-shrink-0`: Prevents the icon from being squeezed if the breadcrumb trail is long.

### 6.2 — Footer Component

**File**: `src/components/layout/footer.tsx`

**Purpose**: The standard site footer, appearing at the bottom of every page within the `AppLayout`.

**Parent Container**: Rendered as the last child inside the root `div` of `AppLayout`.

**DOM Structure & Styling**:

```html
<footer class="bg-card border-t border-border mt-12">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
    <p>&copy; {new Date().getFullYear()} NNP News. All Rights Reserved.</p>
  </div>
</footer>
```

**Styling Details**:
- `<footer>`:
  - `bg-card`: Uses the card background color, distinguishing it from the main page background.
  - `border-t border-border`: A top border to visually separate it from the content above.
  - `mt-12`: `margin-top: 3rem;` Ensures there is always space above the footer.
- `<div>`:
  - `container mx-auto ...`: The standard container class to constrain the width.
  - `py-6`: `padding-top: 1.5rem; padding-bottom: 1.5rem;`
  - `text-center text-muted-foreground`: Centers the text and applies the muted text color.

## Conclusion

This document provides a complete and exhaustive specification for the NNP news website. Every component, style, data structure, and layout decision has been documented with the explicit goal of enabling a perfect recreation. By following this guide, a developer or an AI can reconstruct the application with 100% fidelity to the original design and functionality. The level of detail, including specific Tailwind CSS classes, component props, and contextual layout explanations, leaves no room for ambiguity.

## Part 7: Project Structure and File Contents

This document outlines the complete file structure of the NNP News project and provides a summary of what each file contains.

## Root Directory

-   `package.json`: Defines project metadata, dependencies (`react`, `next`, `firebase`, `tailwindcss`, etc.), and scripts (`dev`, `build`, `start`).
-   `tailwind.config.ts`: Configures the Tailwind CSS framework, including theme colors, fonts, spacing, and plugins.
-   `next.config.ts`: Configures Next.js specific settings, such as image remote patterns and build options.
-   `postcss.config.js`: Configures PostCSS, which is used by Tailwind CSS.
-   `tsconfig.json`: The TypeScript compiler configuration file.
-   `detailed.md`: The ultra-detailed website recreation guide.

## `src` Directory

### `src/ai/`
-   `dev.ts`: Genkit development-related AI configurations.
-   `genkit.ts`: Core Genkit AI flow definitions and configurations.

### `src/app/`
-   `globals.css`: Contains global styles, Tailwind CSS layer definitions, and CSS variables for theming (color palettes, border radius).
-   `layout.tsx`: The root layout for the entire application. It defines the `<html>` and `<body>` tags and includes the necessary font links and the `Toaster` component.
-   `page.tsx`: The component for the **Home Page**. It fetches all articles and displays them in a grid using the `AppLayout`.
-   `favicon.ico`: The icon file for the website.

### `src/app/admin/`
-   `page.tsx`: The component for the **Admin Panel**. A complex client-side component with tabs for adding articles (via form or JSON) and managing database paths. It is protected and requires authentication.

### `src/app/article/[id]/`
-   `page.tsx`: A dynamic page component that displays a **single article**. It fetches the article data based on the `id` from the URL and renders the `ArticleDetail` and `RelatedArticles` components.

### `src/app/category/[slug]/`
-   `page.tsx`: A dynamic page component that displays a **list of articles for a specific category**. It fetches articles based on the `slug` from the URL and uses the `CategoryNewsList` component.

### `src/app/login/`
-   `page.tsx`: The component for the **Admin Login Page**. It provides a form for authentication and handles login logic, error states, and redirection.

### `src/app/search/`
-   `page.tsx`: The component for the **Search Results Page**. It retrieves the search query from the URL, fetches matching articles, and displays them using the `SearchResultsList` component.

### `src/components/layout/`
-   `app-layout.tsx`: The main layout wrapper for most pages. It includes the `Navbar` and `Footer` and ensures a consistent page structure.
-   `breadcrumb.tsx`: A component to display breadcrumb navigation links (e.g., Home > Category > Article).
-   `footer.tsx`: The site-wide footer component.
-   `hamburger-menu.tsx`: The mobile menu button and the slide-out `Sheet` panel that it triggers.
-   `navbar.tsx`: The site-wide header/navigation bar. It is fixed to the top and contains the logo, desktop category navigation, and the `HamburgerMenu`.
-   `sidebar-nav.tsx`: The navigation component rendered inside the `HamburgerMenu` sheet. It includes a search bar and links for all categories and the admin panel.

### `src/components/news/`
-   `article-card.tsx`: A reusable card component to display a preview of an article. Used on the home page, category pages, etc.
-   `article-detail.tsx`: A component that lays out the content of a full article, including title, meta info, image, and body.
-   `category-news-list.tsx`: A component that displays the title and grid of articles for a category page.
-   `headline-display.tsx`: A component intended to display headline news (currently placeholder).
-   `related-articles.tsx`: A component that displays a list of related articles at the bottom of an article detail page.
-   `search-results-list.tsx`: A component that renders the list of results on the search page.
-   `trending-topics.tsx`: A component intended to display trending topics (currently placeholder).

### `src/components/ui/`
This directory contains all the `shadcn/ui` components. These are reusable, low-level UI primitives that form the building blocks of the application's interface.
-   `accordion.tsx`, `alert-dialog.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `sheet.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, etc.

### `src/components/`
-   `search-bar.tsx`: The search input form component, primarily used within the `SidebarNav`.

### `src/flows/`
-   `suggest-related-articles.ts`: An AI flow (using Genkit) for suggesting related article topics.

### `src/hooks/`
-   `use-mobile.tsx`: A custom React hook to detect if the user is on a mobile-sized screen.
-   `use-toast.ts`: A custom hook that provides access to the `toast` function for showing notifications, part of the `shadcn/ui` toaster system.

### `src/lib/`
-   `firebase-data.ts`: Contains all functions for interacting with the Firebase Realtime Database (e.g., `getAllArticles`, `getArticleById`).
-   `firebase.ts`: Handles the initialization of the Firebase app and exports Firebase services like `auth` and `database`.
-   `placeholder-data.ts`: Contains static data for the site, such as the complete list of `CATEGORIES` and the structure of `NAV_ITEMS`.
-   `types.ts`: Defines the core TypeScript types used throughout the application (`Article`, `Category`, `NavItem`).
-   `utils.ts`: Contains utility functions, most notably the `cn` function from `tailwind-merge` for conditional and intelligent merging of CSS classes.

### `src/types/`
-   `custom.d.ts`: A TypeScript declaration file for custom type definitions that might be needed for modules without their own types. 
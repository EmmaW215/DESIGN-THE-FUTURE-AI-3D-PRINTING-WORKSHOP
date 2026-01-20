# 🎯 Course Detail Pages - Design Document

## Minimal & Cost-Effective Implementation Plan

---

## 📦 New Dependencies (Only 2)

```json
{
  "dependencies": {
    "react-router-dom": "^6.22.0",
    "@stripe/stripe-js": "^2.4.0"
  }
}
```

### Cost Analysis:
- ✅ Zero additional hosting cost (Vercel free tier is sufficient)
- ✅ Stripe has no monthly fee (only 2.9% + $0.30 per transaction)
- ✅ No database or backend server needed

---

## 📁 File Structure (Minimal Changes)

```
Existing Structure              New Files
────────────────────────────────────────
App.tsx                → Modified for routing
index.tsx              (unchanged)
services/
  geminiService.ts     (unchanged)
                       + courseData.ts  ← Course data
pages/
                       + LevelDetail.tsx ← Detail page
components/
                       + Navbar.tsx      ← Navigation bar
                       + SessionCard.tsx ← Collapsible card

Total new files: 4
```

---

## 🗺️ Routing Design (Super Simple)

```typescript
// App.tsx modification
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LevelDetail from './pages/LevelDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/level/:id" element={<LevelDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### User Flow:
```
Click Level Card → /level/1 → View Details → Click "Enroll" → Stripe Hosted Payment Page
```

---

## 🎨 Core Page Design

### Page Structure (LevelDetail.tsx)

```
┌─────────────────────────────────────────┐
│ [← Back to Home]           [Logo]       │ ← Sticky Navbar
│                                         │    (reuses homepage colors)
├─────────────────────────────────────────┤
│                                         │
│     🎯 LEVEL 1: EXPLORER               │ ← Hero Section
│     $145 CAD | 3 Sessions              │    (dynamic color theme)
│                                         │
│  Focus: Wonder, Physics, and the       │
│         "Magic" of Layers              │
│                                         │
│     [📚 View Details ↓] [💳 Enroll]    │ ← CTA buttons
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Professional Course Design             │
│  ──────────────────────────             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▶ Session 1: Printing Time Machine│ │ ← Collapsible card
│  │   [Click to expand...]            │ │   (collapsed by default)
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ▼ Session 2: Anatomy of a Robot   │ │ ← Expanded state
│  │ ─────────────────────────────────│ │
│  │ 📖 What You'll Learn:             │ │
│  │ • How the printer works           │ │
│  │ • Hot end, Bed, Filament          │ │
│  │                                   │ │
│  │ 🎮 Activity:                      │ │
│  │ A scavenger hunt to find "3D      │ │
│  │ Printed-able" shapes in the room  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Session 3 Card...]                   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📋 Requirements                        │
│  • Age: 8-14 years old                 │
│  • No prior experience needed          │
│  • (Level 2/3: Bring your laptop)      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ✨ What's Included?                    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐                  │
│  │📦│ │🎁│ │👨‍🏫│ │🏠│                  │
│  └──┘ └──┘ └──┘ └──┘                  │
│  Materials | Prints | Mentor | Takeaway│
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     💳 Ready to Enroll?                │
│  ┌─────────────────────────────────┐  │
│  │   LEVEL 1 EXPLORER PACKAGE      │  │
│  │   ─────────────────────         │  │
│  │   💵 $145 CAD                   │  │
│  │   📅 3 Sessions (90 mins each)  │  │
│  │                                 │  │
│  │   [🔒 Secure Checkout with     │  │
│  │        Stripe →]               │  │
│  └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💳 Stripe Integration (Simplest Approach)

### Approach: Stripe Checkout (Hosted Payment)

**Advantages:**
- ✅ Zero backend code
- ✅ Stripe-hosted payment page (automatic PCI compliance)
- ✅ Mobile-friendly
- ✅ Supports multiple payment methods (Credit Card, Apple Pay, Google Pay)

### Implementation Steps:

#### 1. Create Products in Stripe Dashboard
```
Product 1: "Level 1 Explorer Package"
  - Price: $145 CAD
  - Payment Mode: One-time
  - Copy Price ID: price_xxxxx

Product 2: "Level 2 Apprentice Package"  
  - Price: $185 CAD
  - Copy Price ID: price_yyyyy

Product 3: "Level 3 AI Pro Package"
  - Price: $225 CAD
  - Copy Price ID: price_zzzzz
```

#### 2. Frontend Code (No Backend Needed)
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_YOUR_PUBLIC_KEY');

async function handleEnroll(priceId: string) {
  const stripe = await stripePromise;
  
  // Redirect directly to Stripe hosted payment page
  await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    successUrl: 'https://yourdomain.com/success',
    cancelUrl: 'https://yourdomain.com/level/1',
  });
}
```

### Transaction Fees:
- Level 1: $145 → Fee: $4.51
- Level 2: $185 → Fee: $5.67
- Level 3: $225 → Fee: $6.83

---

## 🎨 Color Theme Reuse

```typescript
// courseData.ts
export const levelThemes = {
  1: {
    color: 'emerald',
    badge: 'bg-emerald-500',
    border: 'border-emerald-500',
    bg: 'bg-emerald-50/30'
  },
  2: {
    color: 'blue',
    badge: 'bg-blue-500',
    border: 'border-blue-500',
    bg: 'bg-blue-50/30'
  },
  3: {
    color: 'red',
    badge: 'bg-red-500',
    border: 'border-red-500',
    bg: 'bg-red-50/30'
  }
};
```

---

## 🧩 Component Design

### 1. SessionCard (Collapsible Card)

```typescript
interface SessionCardProps {
  session: {
    id: number;
    title: string;
    learningPoints: string[];
    activity: string;
    isOptional?: boolean;
  };
  themeColor: string; // 'emerald' | 'blue' | 'red'
}
```

**Features:**
- Default collapsed state (shows title + arrow icon)
- Click to expand/collapse (smooth transition)
- Expanded shows: learning points + activity description
- Optional label (for Level 3's Session 4)

**Visual Effect:**
```
Collapsed:
┌─────────────────────────────────────┐
│ ▶ Session 1: Printing Time Machine  │
└─────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────┐
│ ▼ Session 1: Printing Time Machine  │
│ ───────────────────────────────────  │
│ 📖 What You'll Learn:                │
│ • History of 3D printing             │
│ • Watch a "Live Print" start         │
│                                      │
│ 🎮 Activity:                         │
│ "3D Pen Challenge"—draw a 2D house  │
│ and pull it into 3D                  │
└─────────────────────────────────────┘
```

### 2. Navbar (Sticky Navigation Bar)

**Features:**
- Sticky positioning (always visible when scrolling)
- "← Back to Home" button (uses react-router Link)
- Optional: Display current Level name (Level 1: Explorer)
- Background: Semi-transparent white + backdrop-blur (reuses homepage style)

**Visual Effect:**
```
┌─────────────────────────────────────────┐
│ ← Back to Home      LEVEL 1: EXPLORER   │
└─────────────────────────────────────────┘
Background: rgba(255,255,255,0.9) + blur(12px)
```

---

## 📊 Data Structure (courseData.ts)

```typescript
export interface Session {
  id: number;
  title: string;
  learningPoints: string[];
  activity: string;
  isOptional?: boolean;
}

export interface CourseLevel {
  id: number;
  tag: string;           // "LEVEL 1"
  name: string;          // "EXPLORER"
  fullName: string;      // "3D Explorer (Beginner)"
  price: number;         // 145
  stripePriceId: string; // "price_xxxxx"
  focus: string;
  sessions: Session[];
  requirements: string[];
  needsLaptop: boolean;
  theme: typeof levelThemes[1];
}
```

---

## ⚙️ Environment Variables

```bash
# .env.local
VITE_STRIPE_PUBLIC_KEY=pk_test_51RlrH1E6OOEHr6Zo... # Get from Stripe
VITE_GEMINI_API_KEY=AIza... # Already exists
```

---

## 📋 Stripe Dashboard Configuration Checklist

```
Step 1: Login to https://dashboard.stripe.com/
Step 2: Products → Add Product
  - Name: "Level 1 Explorer Package"
  - Description: "3 Sessions | Ages 8-14 | 3D Printing Basics"
  - Pricing: One-time | $145 CAD
  - Click Save
  - Copy Price ID (price_xxxxx)

Step 3: Repeat for Level 2 ($185) and Level 3 ($225)

Step 4: Settings → API Keys
  - Copy Publishable key (pk_test_...)
  - Paste into .env.local

Step 5: Set Success/Cancel URLs
  - Success URL: https://yourdomain.com/success
  - Cancel URL: https://yourdomain.com/
```

---

## 📦 Complete File List

| File | Type | Estimated Lines |
|------|------|-----------------|
| courseData.ts | Data config | ~150 lines |
| pages/LevelDetail.tsx | Detail page | ~200 lines |
| components/Navbar.tsx | Navigation bar | ~40 lines |
| components/SessionCard.tsx | Collapsible card | ~80 lines |
| App.tsx | Route config | ~30 lines |
| HomePage.tsx | Homepage (from App.tsx) | Already exists |

**Total: ~500 lines of new code**

---

## 🚀 Deployment Steps

```bash
# 1. Install dependencies
npm install react-router-dom @stripe/stripe-js

# 2. Create new files (provided in this implementation)

# 3. Configure environment variables
# In Vercel Dashboard → Settings → Environment Variables
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# 4. Deploy
git add .
git commit -m "Add course detail pages and Stripe checkout"
git push origin main

# Vercel will auto-deploy
```

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Vercel Hosting | $0 (Free tier) |
| Stripe Monthly Fee | $0 (No monthly fee) |
| Stripe Transaction Fee | 2.9% + $0.30/transaction |
| Domain (optional) | ~$12/year |
| **Total** | **Almost zero cost** |

---

## ✅ Features Retained

- ✅ **Session Display** - Collapsible card component
- ✅ **Navigation Bar** - Sticky header with back button
- ✅ **Homepage Color Style** - 100% reused
- ✅ **Border radius, fonts, animations** - Completely consistent

---

## 🎯 Solution Advantages Summary

| Advantage | Description |
|-----------|-------------|
| 💰 Zero Cost | No backend, database, or extra server needed |
| ⚡ Super Simple | Only 4 new files added |
| 🔒 Secure | Stripe hosted payment, PCI compliant |
| 📱 Responsive | Reuses Tailwind, auto-adapts to mobile |
| 🚀 Fast Deployment | Vercel auto-deploy, online in 5 minutes |
| 🎨 Consistent Style | 100% reuses homepage design language |

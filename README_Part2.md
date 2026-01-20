# 🚀 Course Detail Pages - Setup Guide

## Quick Start

### 1️⃣ Install New Dependencies

```bash
npm install react-router-dom @stripe/stripe-js
```

### 2️⃣ Copy Files to Your Project

Copy these files to your project:

```
src/
├── App.tsx                              # Replace existing (new routing config)
├── HomePage.tsx                         # Rename your current App.tsx to this
├── services/
│   └── courseData.ts                    # New file - course data & Stripe config
├── pages/
│   ├── LevelDetail.tsx                  # New file - course detail page
│   └── Success.tsx                      # New file - payment success page
└── components/
    ├── Navbar.tsx                       # New file - navigation bar
    └── SessionCard.tsx                  # New file - collapsible session card
```

### 3️⃣ Modify Your HomePage (Previously App.tsx)

1. **Rename** your current `App.tsx` to `HomePage.tsx`
2. **Add** the Link import at the top:
   ```tsx
   import { Link } from 'react-router-dom';
   ```
3. **Change** the function name:
   ```tsx
   // Before
   function App() { ... }
   
   // After
   export default function HomePage() { ... }
   ```
4. **Wrap** your level cards with Link:
   ```tsx
   // Before
   <div className="level-card">...</div>
   
   // After
   <Link to={`/level/${level.id}`}>
     <div className="level-card hover:scale-[1.02] transition-transform">...</div>
   </Link>
   ```

### 4️⃣ Environment Variables

Create `.env.local` in your project root:

```env
# Existing
VITE_GEMINI_API_KEY=your_gemini_key_here

# New - Stripe (add after setup)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

---

## 🔧 Stripe Configuration (Do Later)

### Step 1: Create Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** → **Add Product**
3. Create 3 products:

| Product Name | Price | Type |
|--------------|-------|------|
| Level 1 Explorer Package | $145 CAD | One-time |
| Level 2 Apprentice Package | $185 CAD | One-time |
| Level 3 AI Pro Package | $225 CAD | One-time |

4. Copy each **Price ID** (e.g., `price_1234abcd...`)

### Step 2: Update Price IDs

In `src/services/courseData.ts`, update:

```typescript
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_PLACEHOLDER',
  priceIds: {
    level1: 'price_YOUR_LEVEL1_PRICE_ID',  // ← Replace
    level2: 'price_YOUR_LEVEL2_PRICE_ID',  // ← Replace
    level3: 'price_YOUR_LEVEL3_PRICE_ID',  // ← Replace
  },
  // ...
};
```

### Step 3: Add Public Key to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add: `VITE_STRIPE_PUBLIC_KEY` = `pk_test_...` (your Stripe publishable key)

---

## 📦 Git Workflow

### Create Feature Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/course-detail-pages

# Add all new files
git add .

# Commit
git commit -m "Add course detail pages with Stripe checkout

- Add routing with react-router-dom
- Add LevelDetail page with course info and enrollment
- Add SessionCard component with expand/collapse
- Add Navbar component with back navigation
- Add Success page for post-payment
- Configure Stripe Checkout integration
- Add comprehensive course data structure"

# Push to feature branch
git push origin feature/course-detail-pages
```

### Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Review changes
4. Merge to main when ready

---

## 📁 Final Project Structure

```
src/
├── App.tsx                    # Router configuration
├── HomePage.tsx               # Main landing page (your old App.tsx)
├── index.tsx                  # Entry point (unchanged)
├── services/
│   ├── geminiService.ts       # Existing AI service
│   └── courseData.ts          # NEW: Course data & Stripe config
├── pages/
│   ├── LevelDetail.tsx        # NEW: Course detail page
│   └── Success.tsx            # NEW: Payment success page
└── components/
    ├── Navbar.tsx             # NEW: Navigation bar
    ├── SessionCard.tsx        # NEW: Collapsible session cards
    └── ... (your existing components)
```

---

## ✅ Testing Checklist

- [ ] Homepage loads correctly
- [ ] Clicking level cards navigates to `/level/1`, `/level/2`, `/level/3`
- [ ] Detail pages show all session information
- [ ] Session cards expand/collapse smoothly
- [ ] "Back to Home" navigation works
- [ ] "Enroll Now" button shows placeholder message (until Stripe configured)
- [ ] Success page displays correctly at `/success`
- [ ] Mobile responsive layout works

---

## 🎨 Customization

### Change Colors

Edit `levelThemes` in `courseData.ts`:

```typescript
export const levelThemes = {
  1: {
    color: 'emerald',     // Change to any Tailwind color
    badge: 'bg-emerald-500',
    // ...
  },
  // ...
};
```

### Edit Course Content

All course information is in `courseData.ts`. Edit the `courses` array to:
- Change session titles and content
- Update prices
- Modify requirements
- Add/remove sessions

---

## 💡 Tips

1. **Test locally first**: Run `npm run dev` and test all pages
2. **Use test mode**: Start with Stripe test keys (pk_test_...)
3. **Check mobile**: Test on different screen sizes
4. **Preview before merge**: Create a Vercel preview deployment from the feature branch

---

## 🆘 Troubleshooting

### "Module not found: react-router-dom"
```bash
npm install react-router-dom
```

### "Stripe not loading"
- Check if `VITE_STRIPE_PUBLIC_KEY` is set
- Make sure you're using the publishable key (starts with `pk_`)

### "Page not found on refresh"
Add to `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

Need help? Check the design document: `COURSE-DETAIL-PAGES-DESIGN.md`

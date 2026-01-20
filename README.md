<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/85eae713-29a5-4897-a799-0d49caf98266" />
</div>

# DESIGN THE FUTURE: AI & 3D Printing Workshop

A modern educational platform for 3D printing and AI workshops, designed for children aged 8-14. This project offers three progressive course levels with AI-powered project suggestions and integrated payment processing.

https://design-the-future-ai-3-d-printing-w.vercel.app/

## Project Overview

This is a **3D Printing & AI Workshop teaching website** targeting children aged 8-14, offering three progressive course levels:

- **LEVEL 1 (EXPLORER)** - $145 CAD - Beginner 3D printing basics
- **LEVEL 2 (APPRENTICE)** - $185 CAD - Intermediate CAD modeling
- **LEVEL 3 (AI PRO INVENTOR)** - $225 CAD - Advanced AI-powered 3D design

## Current Project Status

### ✅ Completed Features

#### Main Pages
- **Homepage** (`HomePage.tsx`) - Course showcase and AI project idea generator
- **Course Detail Page** (`src/pages/LevelDetail.tsx`) - Detailed course information and enrollment
- **Success Page** (`src/pages/Success.tsx`) - Post-payment confirmation

#### Functionality
- ✅ React Router routing configuration
- ✅ Gemini AI integration (for generating project suggestions)
- ✅ Stripe payment integration (configured, requires setup)
- ✅ Responsive design (Tailwind CSS)
- ✅ Three course levels with comprehensive details

#### Components
- `Navbar.tsx` - Navigation bar component
- `SessionCard.tsx` - Collapsible course session cards
- Course data management (`courseData.ts`)

### ⚠️ Known Issues

1. **File Path Mismatch:**
   - `HomePage.tsx` is in the root directory
   - `src/App.tsx` tries to import `./HomePage`, but it should be in `src/` directory
   - This will cause import failures

2. **Gemini Service Path Issue:**
   - `services/geminiService.ts` is in the root directory
   - `HomePage.tsx` imports from `./services/geminiService`, which may be incorrect

3. **Git Status:**
   - `src/App.tsx` shows as deleted (D)
   - Multiple untracked files (??), including `src/` directory
   - File structure may need organization and commit

### 📋 To-Do List

#### Stripe Configuration
- [ ] Create Stripe products and prices
- [ ] Add environment variable `VITE_STRIPE_PUBLIC_KEY`
- [ ] Update price IDs in `courseData.ts`

#### Gemini API Configuration
- [ ] Set environment variable `GEMINI_API_KEY`
- [ ] Note: Both `vite.config.ts` and `geminiService.ts` expect `GEMINI_API_KEY`

#### File Structure Fix
- [ ] Move `HomePage.tsx` to `src/` directory, OR
- [ ] Modify `src/App.tsx` import path

## Tech Stack

- **React** 19.2.3 + **TypeScript**
- **Vite** 6.2.0
- **React Router DOM** 7.12.0
- **Stripe.js** 8.3.3
- **Google Gemini AI**
- **Tailwind CSS**

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
├── src/
│   ├── App.tsx                    # Router configuration
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar
│   │   └── SessionCard.tsx        # Collapsible session cards
│   ├── pages/
│   │   ├── LevelDetail.tsx        # Course detail page
│   │   └── Success.tsx            # Payment success page
│   └── services/
│       └── courseData.ts          # Course data & Stripe config
├── services/
│   └── geminiService.ts           # Gemini AI service
├── HomePage.tsx                   # Main homepage (needs to move to src/)
├── index.html                     # HTML entry point
├── index.tsx                      # React entry point
└── package.json                   # Dependencies
```

## Recommended Next Steps

1. **Fix file path issues** - Move `HomePage.tsx` to `src/` or adjust imports
2. **Configure environment variables** - Create `.env.local` file
3. **Test routing and page navigation** - Verify all routes work correctly
4. **Configure Stripe payment** - Set up products and add API keys
5. **Commit code to Git** - Organize file structure and commit changes

## View in AI Studio

View your app in AI Studio: https://aistudio.google.com/apps/drive/1vrP2gORsSfWeq3AVcv1OpWibRdCEW7FM?fullscreenApplet=true&showPreview=true&showAssistant=true

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes routing configuration for client-side routing.

For deployment:
1. Push your code to a Git repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

---

**Note:** Some file paths may need adjustment before the application runs correctly. See "Known Issues" section above for details.

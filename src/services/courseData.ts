// Course Data Configuration
// This file contains all course information for the 3D Printing Workshop

// ============================================
// THEME CONFIGURATION
// ============================================
export const levelThemes = {
  1: {
    color: 'emerald',
    badge: 'bg-emerald-500',
    badgeHover: 'hover:bg-emerald-600',
    border: 'border-emerald-500',
    borderLight: 'border-emerald-200',
    bg: 'bg-emerald-50/30',
    bgSolid: 'bg-emerald-50',
    text: 'text-emerald-600',
    textDark: 'text-emerald-700',
    ring: 'ring-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  2: {
    color: 'blue',
    badge: 'bg-blue-500',
    badgeHover: 'hover:bg-blue-600',
    border: 'border-blue-500',
    borderLight: 'border-blue-200',
    bg: 'bg-blue-50/30',
    bgSolid: 'bg-blue-50',
    text: 'text-blue-600',
    textDark: 'text-blue-700',
    ring: 'ring-blue-500',
    gradient: 'from-blue-500 to-blue-600',
  },
  3: {
    color: 'red',
    badge: 'bg-red-500',
    badgeHover: 'hover:bg-red-600',
    border: 'border-red-500',
    borderLight: 'border-red-200',
    bg: 'bg-red-50/30',
    bgSolid: 'bg-red-50',
    text: 'text-red-600',
    textDark: 'text-red-700',
    ring: 'ring-red-500',
    gradient: 'from-red-500 to-red-600',
  },
} as const;

export type ThemeKey = keyof typeof levelThemes;
export type Theme = typeof levelThemes[ThemeKey];

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface Session {
  id: number;
  title: string;
  learningPoints: string[];
  activity: string;
  isOptional?: boolean;
}

export interface CourseLevel {
  id: number;
  tag: string;
  name: string;
  fullName: string;
  price: number;
  currency: string;
  stripePriceId: string;
  focus: string;
  description: string;
  sessionDuration: string;
  sessions: Session[];
  requirements: string[];
  needsLaptop: boolean;
  ageRange: string;
  included: {
    icon: string;
    title: string;
    description: string;
  }[];
  theme: Theme;
}

// ============================================
// STRIPE CONFIGURATION
// ============================================
// TODO: Replace these placeholder IDs with your actual Stripe Price IDs
// Get them from: https://dashboard.stripe.com/products
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_PLACEHOLDER',
  priceIds: {
    level1: 'price_LEVEL1_PLACEHOLDER', // Replace with actual price ID
    level2: 'price_LEVEL2_PLACEHOLDER', // Replace with actual price ID
    level3: 'price_LEVEL3_PLACEHOLDER', // Replace with actual price ID
  },
  successUrl: `${window.location.origin}/success`,
  cancelUrl: `${window.location.origin}`,
};

// ============================================
// COURSE DATA
// ============================================
export const courses: CourseLevel[] = [
  {
    id: 1,
    tag: 'LEVEL 1',
    name: 'EXPLORER',
    fullName: '3D Explorer (Beginner)',
    price: 145,
    currency: 'CAD + HST',
    stripePriceId: STRIPE_CONFIG.priceIds.level1,
    focus: "Wonder, Physics, and the 'Magic' of Layers",
    description: ' 🧠 Perfect for curious minds with zero experience. Discover the magic behind 3D printing through hands-on activities and watch your imagination come to life!',
    sessionDuration: '90 mins each',
    ageRange: '8-12 years old',
    sessions: [
      {
        id: 1,
        title: 'The Printing Time Machine',
        learningPoints: [
          'History of 3D printing (from giant houses to medicine)',
          'Watch a "Live Print" start and see layer-by-layer magic',
        ],
        activity: '3D Pen Challenge—draw a 2D house and pull it into 3D to understand the Z-axis',
      },
      {
        id: 2,
        title: 'Anatomy of a Robot Arm',
        learningPoints: [
          'How the printer moves (X, Y, Z axes)',
          'Parts tour: Hot end, Bed, Filament spool',
        ],
        activity: 'A scavenger hunt to find "3D Printed-able" shapes in the room (cylinders, cubes, etc.)',
      },
      {
        id: 3,
        title: 'My First Creation',
        learningPoints: [
          'Introduction to a simple design tool (Tinkercad)',
          'How to export a file for printing',
        ],
        activity: 'Design a custom name tag or keychain; start the print (kids receive it after class)',
      },
    ],
    requirements: [
      'No prior experience needed',
      'Curiosity and enthusiasm!',
      'Comfortable clothes for hands-on activities',
    ],
    needsLaptop: false,
    included: [
      { icon: '📦', title: 'Materials', description: 'All materials provided' },
      { icon: '🎁', title: '3D Print', description: 'Take home your creation' },
      { icon: '👨‍🏫', title: 'Mentorship', description: '1-on-1 guidance' },
      { icon: '🔬', title: 'STEM creations', description: 'Understanding the physical principles' },
    ],
    theme: levelThemes[1],
  },
  {
    id: 2,
    tag: 'LEVEL 2',
    name: 'APPRENTICE',
    fullName: '3D Apprentice (Intermediate)',
    price: 185,
    currency: 'CAD + HST',
    stripePriceId: STRIPE_CONFIG.priceIds.level2,
    focus: 'Problem-Solving, Engineering Mindset, and Functional Design',
    description: ' 🔧 Ready to level up? Learn to solve real-world problems with 3D design. Create functional objects and understand the engineering behind every print!',
    sessionDuration: '90 mins each',
    ageRange: '10-15 years old',
    sessions: [
      {
        id: 1,
        title: 'Engineering Eyes',
        learningPoints: [
          'Why some prints fail (overhangs, supports, infill)',
          'Reading a "slicer" preview',
        ],
        activity: '"Fix the Fail!" — Analyze a broken print, identify the problem, and propose a redesign',
      },
      {
        id: 2,
        title: 'Design for Purpose',
        learningPoints: [
          'Measuring real objects with calipers',
          'Tolerances for moving parts',
        ],
        activity: 'Design a phone stand or cable clip that actually fits their phone',
      },
      {
        id: 3,
        title: 'The Maker Challenge',
        learningPoints: [
          'Time management in design sprints',
          'Presenting your solution',
        ],
        activity: '"Solve a Problem" mini-challenge — given a household problem, design a solution in 30 mins',
      },
    ],
    requirements: [
      'Completed Level 1 or equivalent experience',
      'Basic familiarity with computers',
      'Bring your own laptop (optional but recommended)',
    ],
    needsLaptop: true,
    included: [
      { icon: '📦', title: 'Materials', description: 'Premium materials included' },
      { icon: '🎁', title: '3D Prints', description: 'Multiple prints to keep' },
      { icon: '👨‍🏫', title: 'Mentorship', description: 'Expert guidance' },
      { icon: '🛠️', title: 'Tools', description: 'Professional tools access' },
    ],
    theme: levelThemes[2],
  },
  {
    id: 3,
    tag: 'LEVEL 3',
    name: 'AI PRO',
    fullName: '3D AI Pro (Advanced)',
    price: 225 + 80,
    currency: 'CAD + HST',
    stripePriceId: STRIPE_CONFIG.priceIds.level3,
    focus: 'AI-Assisted Design, Automation, and Creative Workflows',
    description: ' 🤖 The future is here! Combine cutting-edge AI tools with 3D printing. Learn to use AI for design generation, optimization, and create projects that push boundaries!',
    sessionDuration: '90 mins each',
    ageRange: '12-15 years old',
    sessions: [
      {
        id: 1,
        title: 'AI Meets the Printer',
        learningPoints: [
          'How AI generates 3D shapes from text (image-to-3D, text-to-3D)',
          'Limitations and ethics of AI art',
        ],
        activity: 'Generate a creature using an AI tool, critique and refine the output',
      },
      {
        id: 2,
        title: 'Prompt Engineering for Design',
        learningPoints: [
          'Writing effective prompts for design tools',
          'Iterating on AI output',
        ],
        activity: '"Prompt Battle" — teams compete to generate the best design from a secret brief',
      },
      {
        id: 3,
        title: 'The AI Maker Portfolio',
        learningPoints: [
          'Documenting a project for a portfolio',
          'Presenting with confidence',
        ],
        activity: 'Each student designs, prints, and ready for presentation an AI-generated project.',
      },
      {
        id: 4,
        title: 'Advanced Workshop (Optional - Pay extra $80 + HST separately)',
        learningPoints: [
          'documenting a project for a portfolio',
          'presenting with confidence',
          'peer feedback session',
        ],
        activity: 'Collaborative group project using advanced AI techniques learned throughout the course, peer feedback session',
        isOptional: true,
      },
    ],
    requirements: [
      'Completed Level 2 or strong design background',
      'Own laptop required',
      'Basic understanding of AI concepts helpful',
      'Creative mindset and willingness to experiment',
    ],
    needsLaptop: true,
    included: [
      { icon: '📦', title: 'Materials', description: 'Premium & specialty materials' },
      { icon: '🎁', title: 'Portfolio', description: 'Complete project portfolio' },
      { icon: '🤖', title: 'AI Tools', description: 'Access to AI design tools' },
      { icon: '🏆', title: 'PROJECT DEMO DAY', description: 'Presentation for the portfolio' },
    ],
    theme: levelThemes[3],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getCourseById(id: number): CourseLevel | undefined {
  return courses.find((course) => course.id === id);
}

export function getThemeById(id: number): Theme {
  return levelThemes[id as ThemeKey] || levelThemes[1];
}

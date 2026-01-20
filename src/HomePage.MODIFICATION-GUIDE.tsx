// ============================================
// HomePage.tsx - MODIFICATION GUIDE
// ============================================
// 
// This file shows the MINIMAL changes needed to your existing App.tsx
// (which should be renamed to HomePage.tsx)
//
// STEP 1: Rename your current App.tsx to HomePage.tsx
// STEP 2: Add the Link import
// STEP 3: Wrap your level cards with Link components
// STEP 4: Export as default function HomePage()
//
// ============================================

// ADD THIS IMPORT at the top of your file:
import { Link } from 'react-router-dom';

// ... your existing imports stay the same ...

// CHANGE: Rename function from App to HomePage
export default function HomePage() {
  // ... your existing code stays the same ...

  return (
    <div>
      {/* ... your existing JSX ... */}

      {/* 
        FIND your level cards section and wrap each card with Link:
        
        BEFORE:
        ─────────────────────────────────────────────────────────
        {levels.map((level) => (
          <div key={level.id} className="...">
            // card content
          </div>
        ))}
        
        AFTER:
        ─────────────────────────────────────────────────────────
        {levels.map((level) => (
          <Link to={`/level/${level.id}`} key={level.id} className="block">
            <div className="... hover:scale-[1.02] transition-transform cursor-pointer">
              // card content (unchanged)
            </div>
          </Link>
        ))}
      */}

      {/* ... rest of your existing JSX ... */}
    </div>
  );
}

// ============================================
// EXAMPLE: Full Level Cards Section
// ============================================
// Here's an example of what your level cards section might look like:

/*
<section className="py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">
      Choose Your Level
    </h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      {levels.map((level) => (
        <Link 
          to={`/level/${level.id}`} 
          key={level.id}
          className="block group"
        >
          <div className={`
            p-6 rounded-2xl border-2 ${level.borderColor}
            bg-white hover:shadow-xl
            transform hover:scale-[1.02] transition-all duration-300
            cursor-pointer
          `}>
            <span className={`
              inline-block px-3 py-1 rounded-full text-xs font-bold
              text-white ${level.badgeColor} mb-4
            `}>
              {level.tag}
            </span>
            
            <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
            <p className="text-gray-600 mb-4">{level.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${level.price}</span>
              <span className="text-sm text-gray-500">
                {level.sessions} Sessions
              </span>
            </div>
            
            // Add a visual indicator that it's clickable
            <div className="mt-4 text-sm font-medium text-center py-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
              View Details →
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
*/

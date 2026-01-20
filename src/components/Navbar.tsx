import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import type { Theme } from '../services/courseData';

interface NavbarProps {
  levelTag?: string;
  levelName?: string;
  theme?: Theme;
}

export default function Navbar({ levelTag, levelName, theme }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm hidden sm:inline">Back to Home</span>
          </Link>

          {/* Current Level Indicator (optional) */}
          {levelTag && levelName && theme && (
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${theme.badge} flex items-center justify-center`}>
                <Printer className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className={`text-xs font-bold ${theme.text}`}>{levelTag}</span>
                <span className="text-gray-400 mx-1">·</span>
                <span className="text-sm font-semibold text-gray-700">{levelName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

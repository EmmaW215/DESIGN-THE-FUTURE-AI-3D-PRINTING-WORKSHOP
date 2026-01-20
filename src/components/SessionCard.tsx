import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Gamepad2, Sparkles } from 'lucide-react';
import type { Session, Theme } from '../services/courseData';

interface SessionCardProps {
  session: Session;
  theme: Theme;
  defaultExpanded?: boolean;
}

export default function SessionCard({ session, theme, defaultExpanded = false }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`
        rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${isExpanded ? theme.border : 'border-gray-200 hover:border-gray-300'}
        ${isExpanded ? theme.bg : 'bg-white hover:bg-gray-50/50'}
      `}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          {/* Session Number Badge */}
          <span
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
              ${theme.badge}
            `}
          >
            {session.id}
          </span>

          {/* Session Title */}
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
              {session.title}
            </h3>
            {session.isOptional && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                <Sparkles className="w-3 h-3" />
                Optional Session
              </span>
            )}
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${isExpanded ? theme.bgSolid : 'bg-gray-100 group-hover:bg-gray-200'}
          `}
        >
          {isExpanded ? (
            <ChevronDown className={`w-5 h-5 ${theme.text}`} />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content - Expandable */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          {/* Learning Points */}
          <div className="mb-4">
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <BookOpen className="w-4 h-4" />
              <span className="font-medium text-sm">What You'll Learn</span>
            </div>
            <ul className="space-y-2 ml-6">
              {session.learningPoints.map((point, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${theme.badge}`} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Activity */}
          <div>
            <div className={`flex items-center gap-2 mb-2 ${theme.text}`}>
              <Gamepad2 className="w-4 h-4" />
              <span className="font-medium text-sm">Hands-On Activity</span>
            </div>
            <div className={`ml-6 p-3 rounded-lg ${theme.bgSolid}`}>
              <p className={`text-sm ${theme.textDark}`}>
                {session.activity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

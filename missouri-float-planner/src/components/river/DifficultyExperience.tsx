'use client';

// src/components/river/DifficultyExperience.tsx
// Difficulty rating and experience suitability

import type { RiverWithDetails } from '@/types/api';

interface DifficultyExperienceProps {
  river: RiverWithDetails;
}

export default function DifficultyExperience({ river }: DifficultyExperienceProps) {
  // Map difficulty rating to display
  const getDifficultyInfo = (rating: string | null) => {
    if (!rating) return { label: 'Not Rated', color: 'bg-bluff-200', description: 'Difficulty information not available' };
    
    const lower = rating.toLowerCase();
    if (lower.includes('beginner') || lower.includes('easy')) {
      return {
        label: 'Beginner',
        color: 'bg-emerald-500',
        description: 'Suitable for first-time floaters and families. Gentle current, minimal obstacles.',
      };
    } else if (lower.includes('intermediate') || lower.includes('moderate')) {
      return {
        label: 'Intermediate',
        color: 'bg-amber-500',
        description: 'Some experience recommended. May have faster sections or obstacles.',
      };
    } else if (lower.includes('advanced') || lower.includes('difficult') || lower.includes('expert')) {
      return {
        label: 'Advanced',
        color: 'bg-red-500',
        description: 'Experienced floaters only. Fast current, obstacles, and technical sections.',
      };
    }
    return { label: rating, color: 'bg-bluff-400', description: 'See river description for details' };
  };

  const difficulty = getDifficultyInfo(river.difficultyRating);

  // Default suitability (can be enhanced with database fields)
  const suitability = {
    tubing: river.difficultyRating?.toLowerCase().includes('beginner') || !river.difficultyRating,
    canoe: true,
    kayak: true,
    dogFriendly: true,
    familyFriendly: river.difficultyRating?.toLowerCase().includes('beginner') || !river.difficultyRating,
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-ozark-800 mb-4">Difficulty & Experience</h3>

      <div className="space-y-4">
        {/* Difficulty Rating */}
        <div>
          <p className="text-sm font-semibold text-ozark-700 mb-2">Difficulty Rating</p>
          <div className="flex items-center gap-3">
            <div className={`${difficulty.color} rounded-lg px-4 py-2 text-white font-bold`}>
              {difficulty.label}
            </div>
            <p className="text-sm text-bluff-600 flex-1">{difficulty.description}</p>
          </div>
        </div>

        {/* Speed Expectation */}
        <div>
          <p className="text-sm font-semibold text-ozark-700 mb-2">Speed Expectation</p>
          <p className="text-sm text-bluff-600">
            Float speed varies by vessel type and water conditions. Typical speeds:
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-bluff-50 rounded-lg p-2">
              <p className="font-semibold text-ozark-800">Tubing</p>
              <p className="text-bluff-600">1-2 mph</p>
            </div>
            <div className="bg-bluff-50 rounded-lg p-2">
              <p className="font-semibold text-ozark-800">Canoe</p>
              <p className="text-bluff-600">2-3 mph</p>
            </div>
            <div className="bg-bluff-50 rounded-lg p-2">
              <p className="font-semibold text-ozark-800">Kayak</p>
              <p className="text-bluff-600">3-4 mph</p>
            </div>
          </div>
        </div>

        {/* Suitability */}
        <div>
          <p className="text-sm font-semibold text-ozark-700 mb-2">Suitability</p>
          <div className="flex flex-wrap gap-2">
            {suitability.tubing && (
              <span className="px-3 py-1 bg-river-100 text-river-700 rounded-full text-sm font-medium">
                ✓ Tubing Friendly
              </span>
            )}
            {suitability.canoe && (
              <span className="px-3 py-1 bg-river-100 text-river-700 rounded-full text-sm font-medium">
                ✓ Canoe
              </span>
            )}
            {suitability.kayak && (
              <span className="px-3 py-1 bg-river-100 text-river-700 rounded-full text-sm font-medium">
                ✓ Kayak
              </span>
            )}
            {suitability.dogFriendly && (
              <span className="px-3 py-1 bg-golden-100 text-golden-700 rounded-full text-sm font-medium">
                🐕 Dog Friendly
              </span>
            )}
            {suitability.familyFriendly && (
              <span className="px-3 py-1 bg-sunset-100 text-sunset-700 rounded-full text-sm font-medium">
                👨‍👩‍👧‍👦 Family Friendly
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

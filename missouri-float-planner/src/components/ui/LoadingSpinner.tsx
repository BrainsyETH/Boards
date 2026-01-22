// src/components/ui/LoadingSpinner.tsx
// Themed loading spinner with river animation

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: { outer: 'w-5 h-5', inner: 'border-2' },
    md: { outer: 'w-10 h-10', inner: 'border-3' },
    lg: { outer: 'w-16 h-16', inner: 'border-4' },
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={`${sizeConfig[size].outer} rounded-full absolute inset-0 
                      bg-river-500/20 blur-md animate-pulse`}
        />
        {/* Spinning ring */}
        <div
          className={`${sizeConfig[size].outer} ${sizeConfig[size].inner} 
                      border-river-200 border-t-river-500 rounded-full animate-spin`}
        />
      </div>
    </div>
  );
}

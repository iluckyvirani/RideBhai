import React from 'react';
import { Star } from 'lucide-react';

export function RateStars({
  value,
  onPick,
  disabled,
  size = 'md',
}: {
  value?: number;
  onPick?: (stars: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled || !onPick}
          onClick={() => onPick?.(n)}
          className="p-0.5 disabled:cursor-default"
          aria-label={`${n} star`}
        >
          <Star
            className={`${cls} ${n <= (value || 0) ? 'fill-amber-400 text-amber-400' : 'text-[#D8D0C2]'}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ratingLabel(avg?: number, count?: number) {
  const n = Number(avg || 0);
  const c = Number(count || 0);
  if (!c) return 'New';
  return `${n.toFixed(1)} · ${c}`;
}

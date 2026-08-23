import React from 'react';

export const RideCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#EBE5D8] shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#EAE4D7]"></div>
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-[#EAE4D7] rounded"></div>
            <div className="w-16 h-2.5 bg-[#EAE4D7] rounded"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-[#EAE4D7] rounded-lg"></div>
      </div>

      <div className="space-y-2 py-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EAE4D7]"></div>
          <div className="w-40 h-3 bg-[#EAE4D7] rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EAE4D7]"></div>
          <div className="w-32 h-3 bg-[#EAE4D7] rounded"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE1]">
        <div className="w-20 h-3 bg-[#EAE4D7] rounded"></div>
        <div className="w-24 h-8 bg-[#EAE4D7] rounded-xl"></div>
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </div>
  );
};

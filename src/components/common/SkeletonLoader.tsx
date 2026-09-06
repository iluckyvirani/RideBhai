import React from 'react';

function Bone({ className = '' }: { className?: string }) {
  return <div className={`skeleton-bone ${className}`} />;
}

export const RideCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-card space-y-3" aria-hidden>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bone className="w-10 h-10 rounded-2xl" />
          <div className="space-y-1.5">
            <Bone className="w-24 h-3 rounded" />
            <Bone className="w-16 h-2.5 rounded" />
          </div>
        </div>
        <Bone className="w-16 h-6 rounded-lg" />
      </div>
      <Bone className="w-40 h-3 rounded" />
      <Bone className="w-32 h-3 rounded" />
      <div className="grid grid-cols-3 gap-2">
        <Bone className="h-12 rounded-2xl" />
        <Bone className="h-12 rounded-2xl" />
        <Bone className="h-12 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Bone className="h-11 rounded-2xl" />
        <Bone className="h-11 rounded-2xl" />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const PlanCardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading plans">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-[#EBE5D8] bg-white p-5 space-y-3">
          <div className="flex justify-between">
            <Bone className="h-4 w-28 rounded-md" />
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          <Bone className="h-8 w-24 rounded-lg" />
          <Bone className="h-3 w-40 rounded-md" />
          <Bone className="h-3 w-36 rounded-md" />
          <Bone className="h-11 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
};

export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading chats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-[#EBE5D8] bg-white p-4 flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Bone className="h-2.5 w-24 rounded-md" />
            <Bone className="h-3.5 w-40 rounded-md" />
            <Bone className="h-2.5 w-28 rounded-md" />
          </div>
          <Bone className="h-4 w-4 rounded" />
        </div>
      ))}
    </div>
  );
};

export const ChatThreadSkeleton: React.FC = () => {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading messages">
      <div className="rounded-2xl border border-[#EBE5D8] bg-white p-3 space-y-2">
        <Bone className="h-3.5 w-40 rounded-md" />
        <Bone className="h-2.5 w-28 rounded-md" />
      </div>
      <div className="space-y-2">
        <Bone className="h-10 w-3/5 rounded-2xl ml-auto" />
        <Bone className="h-10 w-2/3 rounded-2xl" />
        <Bone className="h-10 w-1/2 rounded-2xl ml-auto" />
        <Bone className="h-10 w-3/5 rounded-2xl" />
      </div>
    </div>
  );
};

export const AppSpinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3" aria-busy="true" aria-label={label}>
      <span className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-[#F15A24]/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#F15A24]" />
      </span>
      <p className="text-[11px] font-extrabold text-[#8A8478]">{label}</p>
    </div>
  );
};

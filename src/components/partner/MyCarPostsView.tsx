import React from 'react';
import { Car } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MyCarPostsView: React.FC = () => {
  const { currentUser, carListings, updateCarListingStatus } = useAppStore();
  const posts = carListings
    .filter((c) => c.partnerId === currentUser?.id)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
        <Car className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
        <p className="text-sm font-bold text-[#6B6B6B]">No car posts yet.</p>
        <p className="text-[11px] text-[#6B6B6B] mt-1">Posts you create with Post car will show here with available from → to.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[#6B6B6B]">
        {posts.length} post{posts.length === 1 ? '' : 's'} · hide or show a listing anytime.
      </p>
      {posts.map((listing) => {
        const live = listing.status === 'available';
        return (
          <article key={listing.id} className="p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-[#1C1C1C]">{listing.carName}</p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {listing.availability === 'route'
                    ? `${listing.currentCity} → ${listing.toCity}`
                    : `Currently in ${listing.currentCity} · All India`}
                  {' · '}₹{listing.fullCarPrice.toLocaleString('en-IN')}
                  {listing.driverName ? ` · ${listing.driverName}` : ''}
                </p>
                {(listing.bookingDate || listing.availableTillDate) && (
                  <p className="text-[11px] font-bold text-[#1C1C1C] mt-0.5">
                    Available {(listing.bookingDate || '').split('-').reverse().join('/')}
                    {listing.bookingTime ? ` ${listing.bookingTime}` : ''}
                    {' → '}
                    {(listing.availableTillDate || '').split('-').reverse().join('/')}
                    {listing.availableTillTime ? ` ${listing.availableTillTime}` : ''}
                  </p>
                )}
              </div>
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  live
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8]'
                }`}
              >
                {live ? 'Showing' : 'Hidden'}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await updateCarListingStatus(listing.id, live ? 'inactive' : 'available');
                } catch (err: any) {
                  window.alert(err?.message || 'Could not update listing.');
                }
              }}
              className="w-full py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-[11px] font-extrabold"
            >
              {live ? 'Hide from customers' : 'Show again'}
            </button>
          </article>
        );
      })}
    </div>
  );
};

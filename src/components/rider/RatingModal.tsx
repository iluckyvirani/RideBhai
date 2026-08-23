import React, { useState } from 'react';
import { Star, X, Check, ThumbsUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface RatingModalProps {
  bookingId: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ bookingId, onClose }) => {
  const { submitReview, bookings, drivers } = useAppStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Great, smooth driving and super clean car!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Clean Car', 'Chilled AC']);

  const booking = bookings.find((b) => b.id === bookingId);
  const driver = booking ? drivers.find((d) => d.id === booking.driverId) : null;

  const quickTags = [
    'Punctual',
    'Clean Car',
    'Chilled AC',
    'Smooth Driving',
    'Polite Host',
    'Great Music',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalComment = selectedTags.length > 0 ? `${selectedTags.join(', ')}. ${comment}` : comment;
    submitReview(bookingId, rating, finalComment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#EBE5D8] animate-scale-in space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#1C1C1C]">Rate Your Driver</h3>
              <p className="text-[11px] text-[#6B6B6B]">{driver?.name || 'Driver'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#6B6B6B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                      : 'text-[#E0D9CB]'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Quick Tag Chips */}
          <div>
            <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
              What went great?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#FFF0EB] text-[#F15A24] border border-[#FFD8CB]'
                        : 'bg-[#FAF6EE] text-[#6B6B6B] border border-[#EBE5D8]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
              Feedback & Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Tell others about your trip experience..."
              className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl brand-gradient text-white font-extrabold text-xs shadow-md active-press flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Submit Rating</span>
          </button>
        </form>
      </div>
    </div>
  );
};

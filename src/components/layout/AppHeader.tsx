import React from 'react';
import { ChevronLeft, Bell, Home, ArrowLeft } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAppStore } from '../../store/useAppStore';
import { useLiveNotifications } from '../../hooks/useLiveNotifications';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications: () => void;
  onExitToLanding?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenNotifications,
  onExitToLanding,
}) => {
  const { currentUser } = useAppStore();
  const { unread: unreadCount } = useLiveNotifications();
  const status = currentUser?.profileStatus;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#EBE5D8] flex items-center justify-between transition-all">
      <div className="flex items-center gap-2">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white border border-[#EBE5D8] flex items-center justify-center text-[#1C1C1C] active-press shadow-sm mr-1"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : onExitToLanding ? (
          <button
            onClick={onExitToLanding}
            className="px-2.5 py-1 rounded-xl bg-white border border-[#EBE5D8] flex items-center gap-1.5 text-[11px] font-bold text-[#6B6B6B] hover:text-[#1C1C1C] active-press shadow-xs mr-1"
            title="Back to Landing Website"
          >
            <Home className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="hidden xs:inline">Website</span>
          </button>
        ) : null}

        {title ? (
          <h1 className="font-display font-extrabold text-base sm:text-lg text-[#1C1C1C] truncate max-w-[170px]">
            {title}
          </h1>
        ) : (
          <Logo size="sm" showTagline={false} />
        )}
      </div>

      <div className="flex items-center gap-2">
        {status && (
          <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#EBE5D8] bg-white shadow-xs">
            {status === 'verified' ? (
              <span className="text-[#00A86B]">Verified</span>
            ) : status === 'pending_verification' ? (
              <span className="text-amber-600">Pending KYC</span>
            ) : status === 'rejected' ? (
              <span className="text-[#E8380D]">Rejected</span>
            ) : (
              <span className="text-[#6B6B6B]">Profile</span>
            )}
          </div>
        )}

        {/* Notifications Button with unread badge */}
        <button
          onClick={onOpenNotifications}
          className="relative w-8 h-8 rounded-full bg-white border border-[#EBE5D8] flex items-center justify-center text-[#1C1C1C] active-press shadow-sm hover:border-[#F15A24]"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E8380D] text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

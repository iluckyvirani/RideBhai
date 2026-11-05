import React from 'react';
import { ChevronLeft, Bell } from 'lucide-react';
import { Logo } from '../common/Logo';
import { LanguageToggle } from '../common/LanguageToggle';
import { useAppStore } from '../../store/useAppStore';
import { useLiveNotifications } from '../../hooks/useLiveNotifications';

interface AppHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications: () => void;
  onExitToLanding?: () => void;
  onLogoClick?: () => void;
  onLoginClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showBack = false,
  onBack,
  onOpenNotifications,
  onExitToLanding,
  onLogoClick,
  onLoginClick,
}) => {
  const { currentUser } = useAppStore();
  const { unread: unreadCount } = useLiveNotifications();
  const status = currentUser?.profileStatus;

  const handleGoWebsite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExitToLanding) {
      onExitToLanding();
    } else {
      window.location.hash = 'home';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6EE]/95 backdrop-blur-md px-3.5 py-2.5 border-b border-[#EBE5D8] flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white border border-[#EBE5D8] flex items-center justify-center text-[#1C1C1C] active-press shadow-sm shrink-0"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : null}

        <a
          href="#home"
          onClick={handleGoWebsite}
          className="min-w-0 active-press inline-flex items-center"
          title="Ride Bhai — Go to Website"
        >
          <Logo size="sm" showTagline={false} />
        </a>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LanguageToggle />

        {!currentUser ? (
          <button
            type="button"
            onClick={onLoginClick}
            className="px-3.5 py-1.5 rounded-full brand-gradient text-white text-[11px] font-extrabold active-press shadow-xs hover:opacity-95"
          >
            Login
          </button>
        ) : (
          <>
            {status && (
              <div className="hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#EBE5D8] bg-white shadow-xs min-[380px]:block">
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
          </>
        )}
      </div>
    </header>
  );
};

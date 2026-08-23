import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Car, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, updateNotifications } = useAppStore();

  if (!isOpen) return null;

  const markAllRead = () => {
    updateNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'boost':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'booking':
        return <Car className="w-4 h-4 text-[#F15A24]" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-[#2E9E5B]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs p-4 pt-12 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#EBE5D8] overflow-hidden animate-slide-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#FAF6EE] border-b border-[#EBE5D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F15A24]" />
            <h3 className="font-bold text-sm text-[#1C1C1C]">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[10px] text-[#F15A24] font-bold hover:underline flex items-center gap-1 active-press"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto divide-y divide-[#F4EFE6] space-y-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B6B6B]">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-2.5 rounded-2xl transition-all flex items-start gap-3 ${
                  !notif.read ? 'bg-[#FFF9F5]' : 'hover:bg-[#FAF6EE]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-[#EBE5D8] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs ${!notif.read ? 'font-extrabold text-[#1C1C1C]' : 'font-semibold text-[#6B6B6B]'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-[#9E9E9E]">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { User, Car, Sparkles, MessageCircle, Plus, CreditCard } from 'lucide-react';

interface BottomNavProps {
  role?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreate?: () => void;
  chatUnread?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onCreate, chatUnread = 0 }) => {
  const left = [
    { id: 'tours', label: 'Tours', icon: Sparkles },
    { id: 'cars', label: 'Cars', icon: Car },
  ];
  const right = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'packages', label: 'Plans', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderTab = (tab: { id: string; label: string; icon: typeof Car }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition-all relative min-w-[48px] ${
          isActive ? 'text-[#F15A24]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
        } active-press`}
      >
        <span className="relative">
          <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          {tab.id === 'chat' && chatUnread > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#F15A24] text-white text-[8px] font-black flex items-center justify-center">
              {chatUnread > 9 ? '9+' : chatUnread}
            </span>
          )}
        </span>
        <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
        {isActive && <span className="w-1 h-1 rounded-full bg-[#F15A24] mt-0.5" />}
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EBE5D8] px-2 pt-1 pb-2 shadow-nav max-w-[430px] mx-auto">
      <div className="flex items-end justify-around">
        {left.map(renderTab)}

        <button
          type="button"
          onClick={onCreate}
          className="relative -mt-7 w-14 h-14 rounded-full brand-gradient text-white shadow-lg flex items-center justify-center active-press border-4 border-white"
          aria-label="Create car or tour"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>

        {right.map(renderTab)}
      </div>
    </nav>
  );
};

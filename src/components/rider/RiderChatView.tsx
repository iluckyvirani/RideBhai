import React, { useState } from 'react';
import { Send, Phone, MessageSquare, Car, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface RiderChatViewProps {
  selectedRideId?: string;
}

export const RiderChatView: React.FC<RiderChatViewProps> = ({ selectedRideId }) => {
  const { chats, sendChatMessage, rides, drivers, isDriverBoosted } = useAppStore();
  const [inputText, setInputText] = useState('');

  // Default to first active ride conversation if not explicitly selected
  const activeRide = selectedRideId
    ? rides.find((r) => r.id === selectedRideId)
    : rides[0];

  const driver = activeRide ? drivers.find((d) => d.id === activeRide.driverId) : drivers[0];
  const isBoosted = driver ? isDriverBoosted(driver.id) : false;

  const quickReplies = [
    'I have reached the pickup point!',
    'Running 5 minutes late.',
    'I have 1 medium backpack with me.',
    'Where is your car parked?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sendChatMessage(text, undefined, activeRide?.id);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-175px)] sm:h-[calc(100vh-165px)] pb-1 animate-fade-in">
      {/* Top Driver Context Bar */}
      {driver && (
        <div className="bg-white rounded-3xl p-3 border border-[#EBE5D8] shadow-xs flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#F15A24]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2E9E5B] ring-1 ring-white" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1">
                {driver.name}
                {isBoosted && <Sparkles className="w-3 h-3 text-[#F15A24] fill-[#F15A24]" />}
              </h4>
              <p className="text-[10px] text-[#6B6B6B]">
                {activeRide?.fromCity} → {activeRide?.toCity}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded-md font-bold">
              Online
            </span>
          </div>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-2.5 p-1 min-h-0 pr-1">
        {chats.map((msg) => {
          const isMe = msg.senderRole === 'rider';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                  isMe
                    ? 'brand-gradient text-white rounded-br-xs'
                    : 'bg-white text-[#1C1C1C] border border-[#EBE5D8] rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                  className={`text-[9px] mt-1 block text-right ${
                    isMe ? 'text-white/80' : 'text-[#9E9E9E]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Replies Carousel without scrollbar */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qr)}
            className="flex-shrink-0 text-[10px] font-semibold text-[#F15A24] bg-white border border-[#FFD8CB] hover:bg-[#FFF0EB] px-2.5 py-1 rounded-full active-press shadow-2xs"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#EBE5D8] shadow-md flex-shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to driver..."
          className="flex-1 text-xs bg-transparent px-2 text-[#1C1C1C] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-xl brand-gradient text-white flex items-center justify-center disabled:opacity-40 active-press shadow-xs flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

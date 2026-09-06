import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../lib/api';
import { mapMessage, type ThreadMessage } from '../../lib/deals';
import { chatClock, chatListTime, withDaySeparators } from '../../lib/chatTime';
import { ChatListSkeleton, ChatThreadSkeleton } from './SkeletonLoader';

export const ChatInboxView: React.FC<{
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
  initialThreadId?: string | null;
  onCloseThread?: () => void;
  onOpenThread?: (id: string) => void;
}> = ({ onNeedUnlock, initialThreadId, onCloseThread, onOpenThread }) => {
  const { chatThreads, currentUser, canBook, sendThreadMessage, refreshDeals } = useAppStore();
  const gate = canBook();
  const [activeId, setActiveId] = useState<string | null>(initialThreadId || null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [error, setError] = useState('');
  const [listLoading, setListLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveId(initialThreadId || null);
  }, [initialThreadId]);

  useEffect(() => {
    refreshDeals().finally(() => setListLoading(false));
  }, [refreshDeals]);

  const loadMessages = async (threadId: string, first = false) => {
    if (first) setThreadLoading(true);
    try {
      const data = await api<{ messages: any[] }>(`/chats/threads/${threadId}/messages`);
      setMessages((data.messages || []).map(mapMessage));
      setError('');
      if (first) await refreshDeals();
    } catch (err: any) {
      setError(err?.message || 'Could not load messages.');
    } finally {
      if (first) setThreadLoading(false);
    }
  };

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId, true);
    const timer = window.setInterval(() => loadMessages(activeId), 8000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, activeId]);

  const active = chatThreads.find((t) => t.id === activeId) || null;
  const myId = currentUser?.id;
  const otherName =
    active?.channel === 'ridebhai'
      ? 'Ride Bhai'
      : active && myId === active.buyerId
        ? active.sellerName || 'Seller'
        : active?.buyerName || 'Buyer';

  const suggestions =
    active?.channel === 'ridebhai'
      ? ['I am interested', 'Let’s close this deal', 'Please confirm the price']
      : ['I am interested', 'Let’s close this deal', 'Is this still available?'];

  const sendBody = async (body: string) => {
    if (!gate.allowed) {
      onNeedUnlock?.(gate.code);
      return;
    }
    if (!body.trim() || !activeId) return;
    try {
      await sendThreadMessage(activeId, body.trim());
      setText('');
      await loadMessages(activeId);
    } catch (err: any) {
      setError(err?.message || 'Could not send.');
    }
  };

  const send = async () => {
    await sendBody(text);
  };

  const openThread = (id: string) => {
    setActiveId(id);
    onOpenThread?.(id);
  };

  if (activeId) {
    const items = withDaySeparators(messages);
    return (
      <div className="flex flex-col h-full min-h-0 bg-[#FAF6EE]">
        <div className="px-3 pt-2 pb-2 flex-shrink-0">
          <div className="p-3 rounded-2xl bg-white border border-[#EBE5D8]">
            <p className="text-xs font-extrabold text-[#1C1C1C] leading-snug">{active?.title || 'Chat'}</p>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5 truncate">
              {otherName}
              {active?.channel === 'ridebhai' ? ' · Inquiry' : ' · Direct'}
              {active?.dealStatus ? ` · ${active.dealStatus}` : ''}
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1 space-y-1.5">
          {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
          {threadLoading && messages.length === 0 && <ChatThreadSkeleton />}
          {items.map((item) => {
            if (item.type === 'day') {
              return (
                <div key={item.id} className="flex justify-center py-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8E2D4] text-[10px] font-extrabold text-[#6B6B6B]">
                    {item.label}
                  </span>
                </div>
              );
            }
            const msg = item.msg;
            const mine = msg.senderId === myId;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] px-3 pt-2 pb-1 text-xs leading-relaxed ${
                    mine
                      ? 'bg-[#F15A24] text-white rounded-2xl rounded-br-md'
                      : 'bg-white border border-[#EBE5D8] rounded-2xl rounded-bl-md'
                  }`}
                >
                  {!mine && <p className="text-[10px] font-extrabold mb-0.5 opacity-70">{msg.senderName}</p>}
                  <p>{msg.body}</p>
                  <p className={`text-[9px] text-right mt-1 ${mine ? 'text-white/75' : 'text-[#8A8478]'}`}>
                    {chatClock(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="flex-shrink-0 px-3 pt-2 pb-2 bg-[#FAF6EE] border-t border-[#EBE5D8]">
          {gate.allowed && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-0.5">
              {suggestions.map((line) => (
                <button
                  key={line}
                  type="button"
                  onClick={() => setText(line)}
                  className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-[#EBE5D8] text-[11px] font-extrabold text-[#1C1C1C] active-press"
                >
                  {line}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={gate.allowed ? 'Type a message' : 'Chat locked until KYC + plan'}
              disabled={!gate.allowed}
              className="flex-1 min-w-0 h-11 px-3.5 rounded-full bg-white border border-[#EBE5D8] text-xs font-bold disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              type="button"
              onClick={send}
              disabled={!gate.allowed}
              className="w-11 h-11 shrink-0 rounded-full brand-gradient text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {!gate.allowed && <p className="text-[11px] font-bold text-[#8A2B09] mt-2">{gate.reason}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-4 animate-fade-in">
      <div className="pb-1">
        <h2 className="text-lg font-extrabold text-[#1C1C1C]">Chat</h2>
        <p className="text-[11px] text-[#6B6B6B]">Last message, time and unread count.</p>
        {!gate.allowed && (
          <p className="text-[11px] font-bold text-[#8A2B09] bg-[#FFF0EB] border border-[#FFD8CB] rounded-2xl p-2.5 mt-2">
            Chat is visible but locked. {gate.reason}
          </p>
        )}
      </div>
      {listLoading && chatThreads.length === 0 && <ChatListSkeleton count={4} />}
      {!listLoading && chatThreads.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <MessageCircle className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No chats yet.</p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            Message direct or Deal with Ride Bhai on a listing.
          </p>
        </div>
      )}
      {chatThreads.map((thread) => {
        const isRideBhai = thread.channel === 'ridebhai';
        const name = isRideBhai ? 'Ride Bhai' : myId === thread.buyerId ? thread.sellerName : thread.buyerName;
        const unread = Number(thread.unreadCount || 0);
        const initial = isRideBhai ? 'RB' : (name || thread.title || 'R').trim().charAt(0).toUpperCase();
        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => openThread(thread.id)}
            className={`w-full text-left p-3 rounded-2xl border flex items-center gap-3 active-press ${
              unread > 0 ? 'bg-[#FFF0EB] border-[#FFD8CB]' : 'bg-white border-[#EBE5D8]'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                unread > 0 ? 'bg-[#F15A24] text-white' : 'bg-[#FAF6EE] text-[#F15A24]'
              }`}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm truncate ${unread > 0 ? 'font-black text-[#1C1C1C]' : 'font-extrabold text-[#1C1C1C]'}`}>
                  {name || 'Ride Bhai user'}
                </p>
                <span className={`text-[10px] shrink-0 ${unread > 0 ? 'font-extrabold text-[#F15A24]' : 'text-[#8A8478]'}`}>
                  {chatListTime(thread.lastMessageAt)}
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#8A8478] truncate">
                {isRideBhai ? `Ride Bhai · ${thread.title}` : thread.title}
              </p>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p
                  className={`text-[11px] line-clamp-1 ${
                    unread > 0 ? 'font-extrabold text-[#1C1C1C]' : 'text-[#6B6B6B]'
                  }`}
                >
                  {thread.lastMessage || 'No messages yet'}
                </p>
                {unread > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#F15A24] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

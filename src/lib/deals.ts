export type DealChannel = 'direct' | 'ridebhai';
export type DealStatus = 'open' | 'pending' | 'success' | 'cancelled';

export type Deal = {
  id: string;
  listingType: 'car' | 'tour';
  listingId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  buyerPhone?: string;
  sellerPhone?: string;
  channel: DealChannel;
  status: DealStatus;
  title: string;
  price: number;
  fromCity?: string;
  toCity?: string;
  threadId?: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  dealId?: string;
  listingType: 'car' | 'tour';
  listingId: string;
  buyerId: string;
  sellerId: string;
  title: string;
  channel?: DealChannel;
  dealStatus?: DealStatus;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  buyerName?: string;
  sellerName?: string;
  buyerPhone?: string;
  sellerPhone?: string;
  price?: number;
};

export type ThreadMessage = {
  id: string;
  threadId: string;
  senderId?: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export function mapDeal(row: any): Deal {
  return {
    id: row.id,
    listingType: row.listing_type === 'tour' ? 'tour' : 'car',
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    buyerName: row.buyer_name || 'Buyer',
    sellerName: row.seller_agency || row.seller_name || 'Seller',
    buyerPhone: row.buyer_phone || undefined,
    sellerPhone: row.seller_phone || undefined,
    channel: row.channel === 'ridebhai' ? 'ridebhai' : 'direct',
    status: (row.status as DealStatus) || 'pending',
    title: row.title,
    price: Number(row.price || 0),
    fromCity: row.from_city || undefined,
    toCity: row.to_city || undefined,
    threadId: row.thread_id || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapThread(row: any): ChatThread {
  return {
    id: row.id,
    dealId: row.deal_id || undefined,
    listingType: row.listing_type === 'tour' || row.deal_listing_type === 'tour' ? 'tour' : 'car',
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    title: row.title || 'Ride Bhai chat',
    channel: row.channel === 'ridebhai' ? 'ridebhai' : row.channel === 'direct' ? 'direct' : undefined,
    dealStatus: row.deal_status || undefined,
    lastMessage: row.last_message || undefined,
    lastMessageAt: row.last_message_at || row.last_at || undefined,
    unreadCount: Number(row.unread_count || 0),
    buyerName: row.buyer_name || undefined,
    sellerName: row.seller_agency || row.seller_name || undefined,
    buyerPhone: row.buyer_phone || undefined,
    sellerPhone: row.seller_phone || undefined,
    price: row.price != null ? Number(row.price) : undefined,
  };
}

export function mapMessage(row: any): ThreadMessage {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id || undefined,
    senderName: row.sender_name || 'User',
    body: row.body,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

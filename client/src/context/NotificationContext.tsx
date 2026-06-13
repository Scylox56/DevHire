import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import api from '../utils/api';

interface NotificationData {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  data: {
    jobId?: string;
    proposalId?: string;
    conversationId?: string;
    transactionId?: string;
    reviewId?: string;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user || initialized) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io({ auth: { token } });
    setSocket(s);
    setInitialized(true);

    s.on('notification:new', (notif: NotificationData) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      const typeLabels: Record<string, string> = {
        proposal_received: 'New Proposal',
        proposal_accepted: 'Proposal Accepted',
        new_message: 'New Message',
        job_awarded: 'Job Awarded',
        payment_released: 'Payment Released',
        review_received: 'New Review',
        work_submitted: 'Work Submitted',
        job_completed: 'Job Completed',
      };
      toast(typeLabels[notif.type] || notif.title, {
        icon: '🔔',
        style: { background: 'var(--card)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
        duration: 4000,
      });
    });

    api.get('/notifications?limit=5').then(({ data }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    }).catch(() => {});

    return () => {
      s.disconnect();
    };
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

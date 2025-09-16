// types.ts
export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  unread: boolean;
}

export interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active: boolean;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface StatsData {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  change: string;
  changeType: 'positive' | 'negative';
}
export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface MetricSummary {
  totalInquiries: number;
  statusBreakdown: { status: string; count: number }[];
  serviceBreakdown: { service: string; count: number }[];
  trendBreakdown: { dateStr: string; count: number }[];
  interactionEvents: { eventType: string; count: number }[];
}

export interface ChatHistoryItem {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  iconName: string; // lucide icon identifier
  details: string[];
  gradient: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  extendedDescription: string;
  image: string; // generated image or elegant placeholder
  liveUrl: string;
  codeUrl: string;
  techStack: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatarUrl: string;
}

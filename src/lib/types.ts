// User & Authentication Types
export type UserRole = 'FOUNDER' | 'INVESTOR' | 'ADMIN';

export type InterestLevel = 'STRONGLY_INTERESTED' | 'WANT_TO_LEARN_MORE' | 'MAYBE_LATER';

export type MeetingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

// Startup Types
export interface Startup {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  fundingGoal?: number;
  website?: string;
  logoUrl?: string;
  pitchDeckUrl?: string;
  demoVideoUrl?: string;
  demoDayBatch?: string;
  pitchDate?: Date;
  qrCode?: string;
  founderName: string;
  founderEmail: string;
  founderAvatar?: string;
  createdAt: Date;
}

// Investor Types
export interface Investor {
  id: string;
  userId: string;
  name: string;
  email: string;
  firm?: string;
  title?: string;
  investmentThesis?: string;
  sectors: string[];
  stages: string[];
  checkSizeMin?: number;
  checkSizeMax?: number;
  portfolioCompanies: string[];
  linkedinUrl?: string;
  avatarUrl?: string;
  createdAt: Date;
}

// Document Types
export interface Document {
  id: string;
  startupId: string;
  title: string;
  type: 'pitch_deck' | 'financials' | 'demo' | 'product_roadmap' | 'team_bios';
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: Date;
}

export interface DocumentView {
  id: string;
  documentId: string;
  viewerId: string;
  viewerEmail: string;
  viewerName: string;
  viewerFirm?: string;
  duration?: number; // seconds
  pagesViewed?: number;
  completionRate?: number; // 0-100
  viewedAt: Date;
}

// Interest Types
export interface Interest {
  id: string;
  startupId: string;
  investorId: string;
  investorName: string;
  investorFirm?: string;
  investorAvatar?: string;
  level: InterestLevel;
  notes?: string;
  isAnonymous: boolean;
  scannedViaQR: boolean;
  scanTimestamp?: Date;
  createdAt: Date;
}

// Meeting Types
export interface Meeting {
  id: string;
  startupId: string;
  startupName: string;
  investorId: string;
  investorName: string;
  investorFirm?: string;
  title: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: MeetingStatus;
  meetingLink?: string;
  notes?: string;
  createdAt: Date;
}

// Update Types
export interface StartupUpdate {
  id: string;
  startupId: string;
  title: string;
  content: string;
  metrics?: {
    mrr?: number;
    users?: number;
    growth?: number;
    [key: string]: any;
  };
  createdAt: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  startupId: string;
  investorId?: string;
  investorName?: string;
  eventType: 'profile_view' | 'document_view' | 'interest_expressed' | 'meeting_scheduled' | 'qr_scan';
  eventData?: any;
  timestamp: Date;
}

// Momentum Score Types
export interface MomentumScore {
  id: string;
  startupId: string;
  score: number;
  rank?: number;
  profileViews: number;
  documentViews: number;
  interestsCount: number;
  meetingsCount: number;
  lastCalculated: Date;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
}

// Dashboard Stats
export interface DashboardStats {
  totalViews: number;
  totalInterests: number;
  totalMeetings: number;
  documentViews: number;
  uniqueInvestors: number;
  conversionRate: number;
  averageEngagement: number;
}

// Matching Types
export interface MatchScore {
  startupId: string;
  investorId: string;
  score: number; // 0-100
  reasons: string[];
  compatibility: {
    sector: number;
    stage: number;
    checkSize: number;
    geography: number;
  };
}
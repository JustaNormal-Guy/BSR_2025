export type ActivityStatus = 'draft' | 'pending' | 'inprogress' | 'result_pending' | 'completed';

export type ActivityType = 
  | 'conference' 
  | 'seminar' 
  | 'awareness_training'
  | 'new_member_training'
  | 'intermediate_training'
  | 'advanced_training'
  | 'hcm_commitment';

export interface Participant {
  id: string;
  name: string;
  position: string;
  unit: string;
  role?: string;
  attended?: boolean;
  notes?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  organizingUnit: string;
  startTime: string;
  endTime?: string;
  location: string;
  description?: string;
  participants: Participant[];
  status: ActivityStatus;
  attachments?: FileAttachment[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityResult {
  activityId: string;
  actualStartTime: string;
  actualEndTime: string;
  actualLocation: string;
  content: string;
  highlights?: string;
  challenges?: string;
  attendanceList: Participant[];
  quality: 'excellent' | 'good' | 'satisfactory' | 'unsatisfactory';
  conclusion?: string;
  recommendations?: string;
  images?: string[];
  documents?: string[];
  reportedBy: string;
  approvedBy?: string;
  approvalComments?: string;
}

export interface Statistics {
  totalActivities: number;
  inProgress: number;
  completed: number;
  completionRate: number;
  byType: { type: string; count: number }[];
  byUnit: { unit: string; count: number; percentage: number }[];
  byMonth: { month: string; count: number }[];
}

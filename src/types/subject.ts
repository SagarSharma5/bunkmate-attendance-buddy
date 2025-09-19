export interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  minimumAttendance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceStats {
  percentage: number;
  canBunk: number;
  mustAttend: number;
  isAtRisk: boolean;
}
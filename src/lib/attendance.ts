import { Subject, AttendanceStats } from "@/types/subject";

export function calculateAttendanceStats(subject: Subject): AttendanceStats {
  const percentage = subject.totalClasses === 0 ? 0 : (subject.attendedClasses / subject.totalClasses) * 100;
  const isAtRisk = percentage < subject.minimumAttendance;
  
  // Calculate how many classes can be bunked while maintaining minimum attendance
  let canBunk = 0;
  if (percentage > subject.minimumAttendance) {
    // Formula: (attended) / (total + x) >= minAttendance/100
    // Solving for x: x <= (attended / (minAttendance/100)) - total
    const maxTotal = Math.floor(subject.attendedClasses / (subject.minimumAttendance / 100));
    canBunk = Math.max(0, maxTotal - subject.totalClasses);
  }
  
  // Calculate how many classes must be attended to reach minimum attendance
  let mustAttend = 0;
  if (percentage < subject.minimumAttendance) {
    // Formula: (attended + x) / (total + x) >= minAttendance/100
    // Solving for x: x >= (minAttendance * total - 100 * attended) / (100 - minAttendance)
    const numerator = (subject.minimumAttendance * subject.totalClasses) - (100 * subject.attendedClasses);
    const denominator = 100 - subject.minimumAttendance;
    mustAttend = Math.max(0, Math.ceil(numerator / denominator));
  }
  
  return {
    percentage: Math.round(percentage * 100) / 100,
    canBunk,
    mustAttend,
    isAtRisk
  };
}

export function formatAttendanceMessage(stats: AttendanceStats): string {
  if (stats.isAtRisk && stats.mustAttend > 0) {
    return `You must attend ${stats.mustAttend} more class${stats.mustAttend !== 1 ? 'es' : ''} to reach minimum attendance`;
  } else if (stats.canBunk > 0) {
    return `You can bunk ${stats.canBunk} more class${stats.canBunk !== 1 ? 'es' : ''}`;
  } else {
    return "Keep attending to maintain your percentage";
  }
}
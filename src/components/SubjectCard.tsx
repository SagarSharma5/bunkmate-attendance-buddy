import { Subject } from "@/types/subject";
import { calculateAttendanceStats, formatAttendanceMessage } from "@/lib/attendance";
import { IOSButton } from "@/components/ui/ios-button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  onAttended: () => void;
  onMissed: () => void;
  onEdit: () => void;
}

export function SubjectCard({ subject, onAttended, onMissed, onEdit }: SubjectCardProps) {
  const stats = calculateAttendanceStats(subject);
  const message = formatAttendanceMessage(stats);

  const getProgressColor = () => {
    if (stats.percentage >= subject.minimumAttendance) return "bg-success";
    if (stats.percentage >= subject.minimumAttendance - 5) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card className="overflow-hidden shadow-sm border-0 bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              {subject.attendedClasses} / {subject.totalClasses} classes
            </p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 -mt-1 -mr-2"
          >
            <MoreHorizontal className="h-4 w-4" />
          </IOSButton>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Attendance</span>
            <span 
              className={cn(
                "text-lg font-bold",
                stats.isAtRisk ? "text-destructive" : "text-success"
              )}
            >
              {stats.percentage.toFixed(1)}%
            </span>
          </div>

          <Progress 
            value={stats.percentage} 
            className="h-2"
            style={{
              background: "hsl(var(--muted))"
            }}
          />

          <p className="text-sm text-muted-foreground">
            {message}
          </p>

          <div className="flex gap-2 pt-2">
            <IOSButton
              variant="success"
              size="sm"
              onClick={onAttended}
              className="flex-1 gap-1"
            >
              <Plus className="h-4 w-4" />
              Attended
            </IOSButton>
            <IOSButton
              variant="destructive"
              size="sm"
              onClick={onMissed}
              className="flex-1 gap-1"
            >
              <Minus className="h-4 w-4" />
              Missed
            </IOSButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
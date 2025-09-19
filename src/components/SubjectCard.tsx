import { Subject } from "@/types/subject";
import { calculateAttendanceStats, formatAttendanceMessage } from "@/lib/attendance";
import { IOSButton } from "@/components/ui/ios-button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  onAttended: () => void;
  onMissed: () => void;
  onAttendedDecrement: () => void;
  onMissedDecrement: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectCard({ 
  subject, 
  onAttended, 
  onMissed, 
  onAttendedDecrement, 
  onMissedDecrement, 
  onEdit, 
  onDelete 
}: SubjectCardProps) {
  const stats = calculateAttendanceStats(subject);
  const message = formatAttendanceMessage(stats);

  // Calculate the stroke dash array for the circular progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  const getProgressColor = () => {
    if (stats.percentage >= subject.minimumAttendance) return "#10b981"; // green-500
    if (stats.percentage >= subject.minimumAttendance - 5) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-gray-900 text-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="font-bold text-2xl text-white mb-1">{subject.name}</h3>
            <p className="text-gray-400 text-sm">
              Last Updated on {new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long' 
              })} at {new Date().toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 -mt-1 -mr-2 text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </IOSButton>
        </div>

        <div className="flex items-center justify-between mb-8">
          {/* Left side - Stats */}
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-white">{subject.attendedClasses}</div>
              <div className="text-gray-400 text-sm">Attended</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{subject.totalClasses - subject.attendedClasses}</div>
              <div className="text-gray-400 text-sm">Missed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{subject.totalClasses}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            
            <div className="pt-2">
              <div className="text-white font-semibold">{message}</div>
              <div className="text-gray-400 text-sm">Requirement: {subject.minimumAttendance}%</div>
            </div>
          </div>

          {/* Right side - Circular Progress */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#374151"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={getProgressColor()}
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-in-out"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {Math.round(stats.percentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between">
          {/* Attended controls */}
          <div className="flex flex-col items-center">
            <div className="text-white font-medium mb-2">Attended</div>
            <div className="flex gap-2">
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={onAttendedDecrement}
                className="h-10 w-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                disabled={subject.attendedClasses <= 0}
              >
                <Minus className="h-4 w-4" />
              </IOSButton>
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={onAttended}
                className="h-10 w-10 rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <Plus className="h-4 w-4" />
              </IOSButton>
            </div>
          </div>

          {/* Delete button - aligned with controls */}
          <div className="flex flex-col items-center">
            <div className="text-white font-medium mb-8"></div>
            <IOSButton
              variant="destructive"
              onClick={onDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </IOSButton>
          </div>

          {/* Missed controls */}
          <div className="flex flex-col items-center">
            <div className="text-white font-medium mb-2">Missed</div>
            <div className="flex gap-2">
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={onMissedDecrement}
                className="h-10 w-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                disabled={(subject.totalClasses - subject.attendedClasses) <= 0}
              >
                <Minus className="h-4 w-4" />
              </IOSButton>
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={onMissed}
                className="h-10 w-10 rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <Plus className="h-4 w-4" />
              </IOSButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
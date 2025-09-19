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
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-1 truncate">{subject.name}</h3>
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
              Last Updated on {new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long' 
              })} at {new Date().toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-gray-400 text-xs sm:hidden">
              Updated {new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-6 w-6 sm:h-8 sm:w-8 -mt-1 -mr-2 text-gray-400 hover:text-white flex-shrink-0"
          >
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </IOSButton>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          {/* Left side - Stats */}
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-3 gap-3 sm:block sm:space-y-3 text-center sm:text-left">
              <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{subject.attendedClasses}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Attended</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{subject.totalClasses - subject.attendedClasses}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Missed</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{subject.totalClasses}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Total</div>
              </div>
            </div>
            
            <div className="pt-3 sm:pt-4 text-center sm:text-left">
              <div className="text-white font-semibold text-sm sm:text-base">{message}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Requirement: {subject.minimumAttendance}%</div>
            </div>
          </div>

          {/* Right side - Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 transform -rotate-90" viewBox="0 0 144 144">
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
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {stats.percentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="space-y-4">
          {/* Mobile: Attended and Missed side by side, Desktop: All controls in a row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
            {/* Mobile: Attended and Missed container */}
            <div className="flex flex-row sm:contents gap-6 sm:gap-2 w-full sm:w-auto justify-center sm:justify-between">
              {/* Attended controls */}
              <div className="flex flex-col items-center flex-1 sm:flex-none">
                <div className="text-white font-medium mb-2 text-sm sm:text-base">Attended</div>
                <div className="flex gap-2">
                  <IOSButton
                    variant="ghost"
                    size="icon"
                    onClick={onAttendedDecrement}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    disabled={subject.attendedClasses <= 0}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </IOSButton>
                  <IOSButton
                    variant="ghost"
                    size="icon"
                    onClick={onAttended}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </IOSButton>
                </div>
              </div>

              {/* Missed controls */}
              <div className="flex flex-col items-center flex-1 sm:flex-none">
                <div className="text-white font-medium mb-2 text-sm sm:text-base">Missed</div>
                <div className="flex gap-2">
                  <IOSButton
                    variant="ghost"
                    size="icon"
                    onClick={onMissedDecrement}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    disabled={(subject.totalClasses - subject.attendedClasses) <= 0}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </IOSButton>
                  <IOSButton
                    variant="ghost"
                    size="icon"
                    onClick={onMissed}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </IOSButton>
                </div>
              </div>
            </div>

            {/* Delete button - hidden on mobile, shown on desktop */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="text-white font-medium mb-2 text-sm sm:text-base">Action</div>
              <IOSButton
                variant="destructive"
                onClick={onDelete}
                className="px-4 py-2 sm:px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </IOSButton>
            </div>
          </div>

          {/* Mobile delete button - shown only on mobile */}
          <div className="sm:hidden flex justify-center pt-2">
            <IOSButton
              variant="destructive"
              onClick={onDelete}
              className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm w-full max-w-xs"
            >
              Delete Subject
            </IOSButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { IOSButton } from "@/components/ui/ios-button";
import { Plus, BookOpen } from "lucide-react";

interface EmptyStateProps {
  onAddSubject: () => void;
}

export function EmptyState({ onAddSubject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No subjects yet
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start tracking your attendance by adding your first subject. You can add up to 2 subjects in the free plan.
      </p>
      
      <IOSButton onClick={onAddSubject} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Subject
      </IOSButton>
    </div>
  );
}
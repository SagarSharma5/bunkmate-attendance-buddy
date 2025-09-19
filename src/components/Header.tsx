import { IOSButton } from "@/components/ui/ios-button";
import { Plus, Settings } from "lucide-react";

interface HeaderProps {
  onAddSubject: () => void;
  onOpenSettings: () => void;
}

export function Header({ onAddSubject, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">BunkMate</h1>
          <p className="text-sm text-muted-foreground">Attendance Tracker</p>
        </div>
        
        <div className="flex items-center gap-2">
          <IOSButton variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="h-5 w-5" />
          </IOSButton>
          <IOSButton variant="primary" size="sm" onClick={onAddSubject} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Subject
          </IOSButton>
        </div>
      </div>
    </header>
  );
}
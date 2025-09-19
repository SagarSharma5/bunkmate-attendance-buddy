import { useState } from "react";
import { Subject } from "@/types/subject";
import { generateId } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IOSButton } from "@/components/ui/ios-button";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSubject: (subject: Subject) => void;
  editingSubject?: Subject | null;
}

export function AddSubjectDialog({ open, onOpenChange, onAddSubject, editingSubject }: AddSubjectDialogProps) {
  const [name, setName] = useState(editingSubject?.name || "");
  const [totalClasses, setTotalClasses] = useState(editingSubject?.totalClasses?.toString() || "0");
  const [attendedClasses, setAttendedClasses] = useState(editingSubject?.attendedClasses?.toString() || "0");
  const [minimumAttendance, setMinimumAttendance] = useState(editingSubject?.minimumAttendance?.toString() || "75");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const subject: Subject = {
      id: editingSubject?.id || generateId(),
      name: name.trim(),
      totalClasses: parseInt(totalClasses) || 0,
      attendedClasses: parseInt(attendedClasses) || 0,
      minimumAttendance: parseInt(minimumAttendance) || 75,
      createdAt: editingSubject?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onAddSubject(subject);
    onOpenChange(false);
    
    // Reset form
    if (!editingSubject) {
      setName("");
      setTotalClasses("0");
      setAttendedClasses("0");
      setMinimumAttendance("75");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
          <DialogDescription>
            {editingSubject ? "Update your subject details" : "Add a new subject to track attendance"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total Classes</Label>
              <Input
                id="total"
                type="number"
                min="0"
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attended">Attended</Label>
              <Input
                id="attended"
                type="number"
                min="0"
                max={totalClasses}
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minimum">Minimum Attendance (%)</Label>
            <Input
              id="minimum"
              type="number"
              min="0"
              max="100"
              value={minimumAttendance}
              onChange={(e) => setMinimumAttendance(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <IOSButton
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </IOSButton>
            <IOSButton type="submit" className="flex-1">
              {editingSubject ? "Update" : "Add"} Subject
            </IOSButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
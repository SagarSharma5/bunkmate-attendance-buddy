import { useState, useEffect } from "react";
import { Subject } from "@/types/subject";
import { getStoredSubjects, saveSubjects, getStorageInfo } from "@/lib/storage";
import { Header } from "@/components/Header";
import { SubjectCard } from "@/components/SubjectCard";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load subjects with loading state
    try {
      const storedSubjects = getStoredSubjects();
      setSubjects(storedSubjects);
      
      // Check storage availability
      const storageInfo = getStorageInfo();
      if (!storageInfo.available) {
        toast({
          title: "Storage not available",
          description: "Your data might not be saved. Please enable localStorage in your browser.",
          variant: "destructive",
        });
      }
      
      console.log(`Loaded ${storedSubjects.length} subjects from storage`);
    } catch (error) {
      console.error("Error loading subjects:", error);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your saved data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Auto-save function with better error handling
  const performSave = (updatedSubjects: Subject[], actionDescription: string) => {
    const success = saveSubjects(updatedSubjects);
    
    if (success) {
      setSubjects(updatedSubjects);
      console.log(`Successfully saved: ${actionDescription}`);
    } else {
      toast({
        title: "Save failed",
        description: "Failed to save your data. Please try again.",
        variant: "destructive",
      });
      // Don't update the state if save failed
      return false;
    }
    return true;
  };

  const handleAddSubject = (subject: Subject) => {
    let updatedSubjects;
    
    if (editingSubject) {
      updatedSubjects = subjects.map(s => s.id === subject.id ? subject : s);
      setEditingSubject(null);
      toast({
        title: "Subject updated",
        description: `${subject.name} has been updated successfully.`,
      });
    } else {
      if (subjects.length >= 2) {
        toast({
          title: "Free plan limit reached",
          description: "You can only track 2 subjects in the free plan. Upgrade to Premium for unlimited subjects.",
          variant: "destructive",
        });
        return;
      }
      updatedSubjects = [...subjects, subject];
      toast({
        title: "Subject added",
        description: `${subject.name} has been added to your tracker.`,
      });
    }
    
    const success = performSave(updatedSubjects, editingSubject ? "subject update" : "subject addition");
    if (!success) {
      // Reset editing state even if save failed
      setEditingSubject(null);
    }
  };

  const handleAttended = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            attendedClasses: subject.attendedClasses + 1,
            updatedAt: new Date()
          }
        : subject
    );
    
    const success = performSave(updatedSubjects, "attendance update");
    if (success) {
      toast({
        title: "Class attended",
        description: "Attended class count increased.",
      });
    }
  };

  const handleMissed = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            updatedAt: new Date()
          }
        : subject
    );
    
    const success = performSave(updatedSubjects, "missed class update");
    if (success) {
      toast({
        title: "Class missed",
        description: "Missed class count increased.",
      });
    }
  };

  const handleAttendedDecrement = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId && subject.attendedClasses > 0) {
        return {
          ...subject,
          totalClasses: Math.max(0, subject.totalClasses - 1),
          attendedClasses: subject.attendedClasses - 1,
          updatedAt: new Date()
        };
      }
      return subject;
    });
    
    const success = performSave(updatedSubjects, "attendance decrement");
    if (success) {
      toast({
        title: "Attendance updated",
        description: "Attended class count decreased.",
      });
    }
  };

  const handleMissedDecrement = (subjectId: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId && (subject.totalClasses - subject.attendedClasses) > 0) {
        return {
          ...subject,
          totalClasses: Math.max(0, subject.totalClasses - 1),
          updatedAt: new Date()
        };
      }
      return subject;
    });
    
    const success = performSave(updatedSubjects, "missed class decrement");
    if (success) {
      toast({
        title: "Attendance updated",
        description: "Missed class count decreased.",
      });
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    const subjectToDelete = subjects.find(s => s.id === subjectId);
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    
    const success = performSave(updatedSubjects, "subject deletion");
    if (success) {
      toast({
        title: "Subject deleted",
        description: `${subjectToDelete?.name || "Subject"} has been removed from your tracker.`,
      });
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowAddDialog(true);
  };

  const handleOpenAddDialog = () => {
    setEditingSubject(null);
    setShowAddDialog(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onAddSubject={handleOpenAddDialog}
      />
      
      <main className="container py-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-white text-lg">Loading your attendance data...</div>
          </div>
        ) : subjects.length === 0 ? (
          <EmptyState onAddSubject={handleOpenAddDialog} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onAttended={() => handleAttended(subject.id)}
                onMissed={() => handleMissed(subject.id)}
                onAttendedDecrement={() => handleAttendedDecrement(subject.id)}
                onMissedDecrement={() => handleMissedDecrement(subject.id)}
                onEdit={() => handleEditSubject(subject)}
                onDelete={() => handleDeleteSubject(subject.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddSubjectDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddSubject={handleAddSubject}
        editingSubject={editingSubject}
      />
    </div>
  );
};

export default Index;

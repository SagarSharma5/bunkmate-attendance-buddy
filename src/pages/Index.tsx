import { useState, useEffect } from "react";
import { Subject } from "@/types/subject";
import { getStoredSubjects, saveSubjects, getStorageInfo } from "@/lib/storage";
import { Header } from "@/components/Header";
import { SubjectCard } from "@/components/SubjectCard";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
    // Create inline form for editing
    const newName = prompt("Enter new subject name:", subject.name);
    if (newName && newName.trim()) {
      const updatedSubjects = subjects.map(s => 
        s.id === subject.id 
          ? { ...s, name: newName.trim() }
          : s
      );
      setSubjects(updatedSubjects);
      saveSubjects(updatedSubjects);
      toast({
        title: "Subject updated",
        description: `${subject.name} has been renamed to ${newName.trim()}`,
      });
    }
    setEditingSubject(null);
  };

  const handleOpenAddDialog = () => {
    const newName = prompt("Enter subject name:");
    if (newName && newName.trim()) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newName.trim(),
        totalClasses: 0,
        attendedClasses: 0,
        minimumAttendance: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedSubjects = [...subjects, newSubject];
      setSubjects(updatedSubjects);
      saveSubjects(updatedSubjects);
      
      toast({
        title: "Subject added",
        description: `${newName.trim()} has been added to your subjects.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onAddSubject={handleOpenAddDialog}
      />
      
      <main className="container px-4 py-6 max-w-7xl mx-auto mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-white text-base sm:text-lg">Loading your attendance data...</div>
          </div>
        ) : subjects.length === 0 ? (
          <EmptyState onAddSubject={handleOpenAddDialog} />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default Index;

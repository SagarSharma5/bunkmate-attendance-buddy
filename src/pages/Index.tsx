import { useState, useEffect } from "react";
import { Subject } from "@/types/subject";
import { getStoredSubjects, saveSubjects } from "@/lib/storage";
import { Header } from "@/components/Header";
import { SubjectCard } from "@/components/SubjectCard";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedSubjects = getStoredSubjects();
    setSubjects(storedSubjects);
  }, []);

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
    
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
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
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
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
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
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
    <div className="min-h-screen bg-background">
      <Header 
        onAddSubject={handleOpenAddDialog}
        onOpenSettings={() => {}}
      />
      
      <main className="container py-6">
        {subjects.length === 0 ? (
          <EmptyState onAddSubject={handleOpenAddDialog} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onAttended={() => handleAttended(subject.id)}
                onMissed={() => handleMissed(subject.id)}
                onEdit={() => handleEditSubject(subject)}
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

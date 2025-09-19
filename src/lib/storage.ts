import { Subject } from "@/types/subject";

const STORAGE_KEY = "bunkmate_subjects";

export function getStoredSubjects(): Subject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const subjects = JSON.parse(stored);
    return subjects.map((subject: any) => ({
      ...subject,
      createdAt: new Date(subject.createdAt),
      updatedAt: new Date(subject.updatedAt)
    }));
  } catch (error) {
    console.error("Error loading subjects:", error);
    return [];
  }
}

export function saveSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (error) {
    console.error("Error saving subjects:", error);
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
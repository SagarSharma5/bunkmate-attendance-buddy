import { Subject } from "@/types/subject";

const STORAGE_KEY = "bunkmate_subjects";
const BACKUP_KEY = "bunkmate_subjects_backup";
const VERSION_KEY = "bunkmate_version";
const SETTINGS_KEY = "bunkmate_settings";

const CURRENT_VERSION = "1.0.0";

interface AppSettings {
  version: string;
  lastBackup: string;
  dataVersion: number;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  version: CURRENT_VERSION,
  lastBackup: new Date().toISOString(),
  dataVersion: 1
};

/**
 * Check if localStorage is available and working
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate subject data structure
 */
function validateSubject(subject: any): subject is Subject {
  return (
    typeof subject === 'object' &&
    typeof subject.id === 'string' &&
    typeof subject.name === 'string' &&
    typeof subject.totalClasses === 'number' &&
    typeof subject.attendedClasses === 'number' &&
    typeof subject.minimumAttendance === 'number' &&
    subject.createdAt &&
    subject.updatedAt
  );
}

/**
 * Get app settings from localStorage
 */
export function getAppSettings(): AppSettings {
  if (!isLocalStorageAvailable()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      saveAppSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    
    const settings = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    console.error("Error loading app settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save app settings to localStorage
 */
export function saveAppSettings(settings: AppSettings): void {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available, settings not saved");
    return;
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving app settings:", error);
  }
}

/**
 * Create a backup of current data
 */
function createBackup(subjects: Subject[]): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const backup = {
      subjects,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    
    // Update last backup time in settings
    const settings = getAppSettings();
    settings.lastBackup = new Date().toISOString();
    saveAppSettings(settings);
  } catch (error) {
    console.error("Error creating backup:", error);
  }
}

/**
 * Restore data from backup
 */
export function restoreFromBackup(): Subject[] | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) return null;

    const backupData = JSON.parse(backup);
    if (backupData.subjects && Array.isArray(backupData.subjects)) {
      return backupData.subjects.map((subject: any) => ({
        ...subject,
        createdAt: new Date(subject.createdAt),
        updatedAt: new Date(subject.updatedAt)
      }));
    }
    return null;
  } catch (error) {
    console.error("Error restoring from backup:", error);
    return null;
  }
}

/**
 * Get stored subjects with enhanced error handling and validation
 */
export function getStoredSubjects(): Subject[] {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available, returning empty array");
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const subjects = JSON.parse(stored);
    
    if (!Array.isArray(subjects)) {
      console.error("Stored data is not an array, returning empty array");
      return [];
    }

    // Validate and filter subjects
    const validSubjects = subjects
      .filter(validateSubject)
      .map((subject: any) => ({
        ...subject,
        createdAt: new Date(subject.createdAt),
        updatedAt: new Date(subject.updatedAt)
      }));

    // If some subjects were invalid, save the cleaned data
    if (validSubjects.length !== subjects.length) {
      console.warn(`Removed ${subjects.length - validSubjects.length} invalid subjects`);
      saveSubjects(validSubjects);
    }

    return validSubjects;
  } catch (error) {
    console.error("Error loading subjects:", error);
    
    // Try to restore from backup
    const backupData = restoreFromBackup();
    if (backupData) {
      console.log("Restored data from backup");
      return backupData;
    }
    
    return [];
  }
}

/**
 * Save subjects with backup and validation
 */
export function saveSubjects(subjects: Subject[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available, data not saved");
    return false;
  }

  // Validate all subjects before saving
  const validSubjects = subjects.filter(validateSubject);
  if (validSubjects.length !== subjects.length) {
    console.warn(`Filtered out ${subjects.length - validSubjects.length} invalid subjects`);
  }

  try {
    // Create backup before saving new data
    createBackup(getStoredSubjects());
    
    // Save the new data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validSubjects));
    
    console.log(`Successfully saved ${validSubjects.length} subjects`);
    return true;
  } catch (error) {
    console.error("Error saving subjects:", error);
    
    // If saving failed due to quota, try to free up space
    if (error instanceof DOMException && error.code === 22) {
      console.warn("Storage quota exceeded, attempting to clear old data");
      clearOldData();
      
      // Try saving again without backup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validSubjects));
        return true;
      } catch (retryError) {
        console.error("Failed to save even after clearing old data:", retryError);
      }
    }
    
    return false;
  }
}

/**
 * Clear old or unnecessary data to free up storage space
 */
function clearOldData(): void {
  try {
    // Remove backup if storage is full
    localStorage.removeItem(BACKUP_KEY);
    console.log("Cleared backup data to free up space");
  } catch (error) {
    console.error("Error clearing old data:", error);
  }
}

/**
 * Export all data for manual backup
 */
export function exportData(): string {
  const subjects = getStoredSubjects();
  const settings = getAppSettings();
  
  const exportData = {
    subjects,
    settings,
    exportDate: new Date().toISOString(),
    version: CURRENT_VERSION
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import data from exported JSON
 */
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.subjects && Array.isArray(data.subjects)) {
      const validSubjects = data.subjects.filter(validateSubject);
      const success = saveSubjects(validSubjects);
      
      if (success) {
        console.log(`Successfully imported ${validSubjects.length} subjects`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

/**
 * Clear all app data
 */
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    console.log("All app data cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; available: boolean } {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: false };
  }

  try {
    const allData = Object.keys(localStorage)
      .filter(key => key.startsWith('bunkmate_'))
      .reduce((total, key) => {
        const item = localStorage.getItem(key);
        return total + (item ? item.length : 0);
      }, 0);

    return {
      used: allData,
      available: true
    };
  } catch (error) {
    return { used: 0, available: false };
  }
}

/**
 * Generate a unique ID for subjects
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
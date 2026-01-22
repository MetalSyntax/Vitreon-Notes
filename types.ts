export interface Note {
    id: string;
    title: string;
    content: string; // Used for text or JSON string of checklist items
    category: string;
    isPinned: boolean;
    isArchived: boolean;
    isLocked: boolean;
    lockPin?: string; // Simple PIN storage
    isChecklist: boolean;
    tags: string[];
    images: string[]; // Base64 strings
    drawings: string[]; // Base64 strings
    voiceNotes: string[]; // Base64 audio strings
    createdAt: number;
    updatedAt: number;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
    theme: ThemeMode;
    googleDriveConnected: boolean;
}
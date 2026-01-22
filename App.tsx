import React, { useState, useEffect } from 'react';
import { Note, Category, ThemeMode } from './types';
import { saveNote, getNotes, deleteNote, exportDataToJSON, importDataFromJSON } from './services/storage';
import { PinModal } from './components/modals/PinModal';
import { HomeView } from './features/home/HomeView';
import { NoteEditor } from './features/editor/NoteEditor';
import { CategoriesView } from './features/categories/CategoriesView';
import { SettingsView } from './features/settings/SettingsView';

// --- Constants ---
const CATEGORIES: Category[] = [
    { id: 'work', name: 'Work', color: 'blue', icon: 'work' },
    { id: 'personal', name: 'Personal', color: 'emerald', icon: 'person' },
    { id: 'ideas', name: 'Ideas', color: 'amber', icon: 'lightbulb' },
    { id: 'travel', name: 'Travel', color: 'purple', icon: 'flight' },
    { id: 'fitness', name: 'Fitness', color: 'rose', icon: 'fitness_center' },
    { id: 'uncategorized', name: 'General', color: 'slate', icon: 'description' },
];

const DEFAULT_CATEGORY = 'uncategorized';

export default function App() {
    const [theme, setTheme] = useState<ThemeMode>('dark');
    const [view, setView] = useState<'home' | 'editor' | 'categories' | 'settings'>('home');
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);
    const [pinModal, setPinModal] = useState<{ open: boolean, mode: 'unlock'|'set', noteId?: string }>({ open: false, mode: 'unlock' });

    // Initial Load
    useEffect(() => {
        const load = async () => {
            const stored = await getNotes();
            setNotes(stored);
            setIsLoading(false);
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                setTheme('light');
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleCreateNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(), title: '', content: '', category: DEFAULT_CATEGORY,
            isPinned: false, isArchived: false, isLocked: false, isChecklist: false,
            tags: [], images: [], drawings: [], voiceNotes: [],
            createdAt: Date.now(), updatedAt: Date.now()
        };
        setCurrentNote(newNote);
        setView('editor');
    };

    const handleSaveNote = async (updatedNote: Note) => {
        let titleToSave = updatedNote.title;
        if (!titleToSave) {
            titleToSave = updatedNote.isChecklist ? 'Checklist' : (updatedNote.content.split('\n')[0].substring(0, 30) || 'Untitled Note');
        }
        const toSave = { ...updatedNote, title: titleToSave, updatedAt: Date.now() };
        await saveNote(toSave);
        setNotes(await getNotes());
        setCurrentNote(toSave);
        showToast("Note saved.");
    };

    const handleDeleteNote = async (id: string) => {
        if(!confirm("Are you sure?")) return;
        await deleteNote(id);
        setNotes(await getNotes());
        if (currentNote?.id === id) { setCurrentNote(null); setView('home'); }
        showToast("Note deleted.");
    };

    const handleArchiveNote = async (note: Note) => {
        const updated = { ...note, isArchived: !note.isArchived };
        await handleSaveNote(updated);
        showToast(updated.isArchived ? "Archived." : "Unarchived.");
    };

    // Locking Logic
    const initiateLock = (note: Note) => {
        if (note.isLocked) {
            const updated = { ...note, isLocked: false, lockPin: undefined };
            handleSaveNote(updated);
            showToast("Lock removed.");
        } else {
            setCurrentNote(note); // Ensure we are targeting this note
            setPinModal({ open: true, mode: 'set' });
        }
    };

    const handlePinResult = async (pin: string) => {
        if (pinModal.mode === 'set' && currentNote) {
            const updated = { ...currentNote, isLocked: true, lockPin: pin };
            await handleSaveNote(updated);
            setPinModal({ ...pinModal, open: false });
            showToast("Note locked.");
        } else if (pinModal.mode === 'unlock') {
            const noteToUnlock = notes.find(n => n.id === pinModal.noteId);
            if (noteToUnlock && noteToUnlock.lockPin === pin) {
                setCurrentNote(noteToUnlock);
                setPinModal({ ...pinModal, open: false });
                setView('editor');
            } else {
                alert("Incorrect PIN");
            }
        }
    };

    const handleNoteClick = (note: Note) => {
        if (note.isLocked) setPinModal({ open: true, mode: 'unlock', noteId: note.id });
        else { setCurrentNote(note); setView('editor'); }
    };

    // Import/Export
    const handleExport = async () => {
        try {
            const json = await exportDataToJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `lumina_backup_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            showToast("Exported.");
        } catch (e) { showToast("Export failed."); }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            if (event.target?.result) {
                try {
                    const count = await importDataFromJSON(event.target.result as string);
                    setNotes(await getNotes());
                    showToast(`Imported ${count} notes.`);
                } catch { showToast("Import failed."); }
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className={`min-h-screen w-full transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#f0f4f8] text-slate-900'}`}>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 filter blur-[100px] opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 filter blur-[100px] opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 max-w-md mx-auto h-screen shadow-2xl overflow-hidden bg-glass-100 backdrop-blur-sm border-x border-white/5 flex flex-col">
                <div className="flex-1 overflow-hidden relative">
                    {view === 'home' && <HomeView notes={notes} categories={CATEGORIES} onNoteClick={handleNoteClick} showArchived={showArchived} onToggleArchive={() => setShowArchived(!showArchived)} />}
                    {view === 'categories' && <CategoriesView categories={CATEGORIES} notes={notes} onCategoryClick={(c) => { showToast(`Filtered by ${c.name}`); setView('home'); }} />}
                    {view === 'settings' && <SettingsView theme={theme} setTheme={setTheme} onExport={handleExport} onImport={handleImport} />}
                    {view === 'editor' && currentNote && (
                        <NoteEditor 
                            initialNote={currentNote} categories={CATEGORIES}
                            onSave={handleSaveNote} onDelete={handleDeleteNote} onArchive={handleArchiveNote} onLock={initiateLock}
                            onBack={() => setView('home')}
                        />
                    )}
                </div>

                {view !== 'editor' && (
                    <div className="h-20 absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl flex items-center justify-around px-6 z-20 safe-area-pb">
                        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-indigo-500' : 'text-slate-400'}`}><span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: view === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span><span className="text-[10px] font-medium">Home</span></button>
                        <button onClick={() => setView('categories')} className={`flex flex-col items-center gap-1 ${view === 'categories' ? 'text-indigo-500' : 'text-slate-400'}`}><span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: view === 'categories' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span><span className="text-[10px] font-medium">Categories</span></button>
                        <div className="w-12"></div>
                        <button onClick={() => {setShowArchived(true); setView('home');}} className={`flex flex-col items-center gap-1 ${showArchived ? 'text-indigo-500' : 'text-slate-400'}`}><span className="material-symbols-rounded text-2xl">archive</span><span className="text-[10px] font-medium">Archive</span></button>
                        <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 ${view === 'settings' ? 'text-indigo-500' : 'text-slate-400'}`}><span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: view === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span><span className="text-[10px] font-medium">Settings</span></button>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <button onClick={handleCreateNote} className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><span className="material-symbols-rounded text-3xl">add</span></button>
                        </div>
                    </div>
                )}
            </div>

            <PinModal isOpen={pinModal.open} onClose={() => setPinModal({...pinModal, open: false})} isSettingPin={pinModal.mode === 'set'} onUnlock={handlePinResult} />
            {toastMsg && <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-full glass-panel shadow-xl text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2"><span className="material-symbols-rounded text-green-500 text-lg">check_circle</span>{toastMsg}</div>}
        </div>
    );
}
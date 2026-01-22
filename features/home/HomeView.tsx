import React, { useState } from 'react';
import { Note, Category } from '../../types';
import { NoteCard } from '../../components/notes/NoteCard';

interface HomeViewProps {
    notes: Note[];
    categories: Category[];
    onNoteClick: (note: Note) => void;
    showArchived: boolean;
    onToggleArchive: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ notes, categories, onNoteClick, showArchived, onToggleArchive }) => {
    const [searchQuery, setSearchQuery] = useState('');

    let filtered = notes.filter(n => n.isArchived === showArchived);
    if (searchQuery) {
        filtered = filtered.filter(n => 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (!n.isLocked && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    const pinned = filtered.filter(n => n.isPinned);
    const recent = filtered.filter(n => !n.isPinned);

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-24">
            <div className="sticky top-0 z-10 p-6 pb-2 glass-blur backdrop-blur-xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{showArchived ? 'Archive' : 'Lumina'}</h1>
                    <button onClick={onToggleArchive} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-rounded">{showArchived ? 'inbox' : 'archive'}</span>
                    </button>
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 material-symbols-rounded text-slate-400">search</span>
                    <input
                        type="text" placeholder={showArchived ? "Search archive..." : "Search notes..."}
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-md transition-all"
                    />
                </div>
            </div>

            {!showArchived && pinned.length > 0 && (
                <div className="mt-4 px-6">
                    <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pinned</h2></div>
                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                        {pinned.map(note => <NoteCard key={note.id} note={note} category={categories.find(c => c.id === note.category)} onClick={() => onNoteClick(note)} layout="carousel" />)}
                    </div>
                </div>
            )}

            <div className="mt-2 px-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">{showArchived ? 'Archived Notes' : 'Recent'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recent.map(note => <NoteCard key={note.id} note={note} category={categories.find(c => c.id === note.category)} onClick={() => onNoteClick(note)} layout="grid" />)}
                    {recent.length === 0 && pinned.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                            <span className="material-symbols-rounded text-6xl mb-4 text-slate-400 dark:text-slate-600">stylus_note</span>
                            <p className="text-slate-500 dark:text-slate-400">{showArchived ? "Archive is empty" : "Start your first thought."}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
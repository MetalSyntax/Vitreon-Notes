import React from 'react';
import { Note, Category } from '../../types';

interface NoteCardProps {
    note: Note;
    category?: Category;
    onClick: () => void;
    layout?: 'grid' | 'carousel';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, category, onClick, layout = 'grid' }) => {
    const isCarousel = layout === 'carousel';

    return (
        <div 
            onClick={onClick}
            className={`glass-card p-5 rounded-2xl cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 transition-colors relative overflow-hidden
            ${isCarousel ? 'snap-start min-w-[280px] flex flex-col justify-between h-40' : ''}`}
        >
            {note.isLocked ? (
                <div className={`flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 ${isCarousel ? 'h-full' : 'py-8'}`}>
                    <span className="material-symbols-rounded text-3xl mb-1">lock</span>
                    <span className="text-xs font-mono">Encrypted</span>
                </div>
            ) : (
                <>
                    <div className={isCarousel ? "" : "mb-2"}>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{note.title || "Untitled"}</h3>
                            {!isCarousel && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                                </span>
                            )}
                        </div>
                        <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${isCarousel ? 'line-clamp-2 mt-2' : 'line-clamp-3'}`}>
                            {note.isChecklist ? '☑ List Items...' : (note.content || "No text content...")}
                        </p>
                    </div>

                    {isCarousel ? (
                         <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full bg-${category?.color || 'slate'}-500/10 text-${category?.color || 'slate'}-600 dark:text-${category?.color || 'slate'}-300`}>
                                {category?.name || 'General'}
                            </span>
                            <span className="material-symbols-rounded text-indigo-400 text-sm">push_pin</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-3 mt-4 text-slate-400 dark:text-slate-500">
                                {note.images.length > 0 && <span className="material-symbols-rounded text-sm">image</span>}
                                {note.drawings.length > 0 && <span className="material-symbols-rounded text-sm">draw</span>}
                                {note.voiceNotes.length > 0 && <span className="material-symbols-rounded text-sm">mic</span>}
                            </div>
                            {note.tags.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {note.tags.slice(0,3).map(t => (
                                        <span key={t} className="text-[10px] text-indigo-600 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">#{t}</span>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
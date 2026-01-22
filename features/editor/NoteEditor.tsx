import React, { useState, useRef } from 'react';
import { Note, Category } from '../../types';
import { IconButton } from '../../components/ui/IconButton';
import { DrawingModal } from '../../components/modals/DrawingModal';

interface NoteEditorProps {
    initialNote: Note;
    categories: Category[];
    onSave: (note: Note) => void;
    onDelete: (id: string) => void;
    onArchive: (note: Note) => void;
    onLock: (note: Note) => void;
    onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
    initialNote, categories, onSave, onDelete, onArchive, onLock, onBack 
}) => {
    // Local state for the editor to avoid re-rendering the whole app on every keystroke
    const [note, setNote] = useState<Note>(initialNote);
    const [showDrawModal, setShowDrawModal] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [tagInput, setTagInput] = useState('');
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNote(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveDrawing = (dataUrl: string) => {
        setNote(prev => ({ ...prev, drawings: [...prev.drawings, dataUrl] }));
    };

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                const chunks: BlobPart[] = [];
                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setNote(prev => ({ ...prev, voiceNotes: [...prev.voiceNotes, reader.result as string] }));
                    };
                    reader.readAsDataURL(blob);
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Mic error", err);
                alert("Microphone access denied.");
            }
        }
    };

    const triggerSave = () => onSave(note);

    return (
        <div className="fixed inset-0 z-50 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-3xl flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={triggerSave} 
                        className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <span className="material-symbols-rounded text-lg">arrow_back</span>
                        Save
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <IconButton icon={note.isLocked ? 'lock' : 'lock_open'} active={note.isLocked} onClick={() => onLock(note)} title="Lock Note" />
                    <IconButton icon={note.isArchived ? 'unarchive' : 'archive'} active={note.isArchived} onClick={() => onArchive(note)} title="Archive" />
                    <IconButton icon="delete" className="text-red-400 hover:bg-red-500/10" onClick={() => onDelete(note.id)} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full no-scrollbar">
                <input
                    className="w-full bg-transparent text-3xl font-bold placeholder-slate-300 dark:placeholder-slate-600 border-none focus:ring-0 p-0 mb-4 text-slate-900 dark:text-white"
                    placeholder="Title..."
                    value={note.title}
                    onChange={e => setNote({ ...note, title: e.target.value })}
                />
                
                {/* Meta */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
                    <div className="relative group">
                        <select 
                            value={note.category}
                            onChange={e => setNote({...note, category: e.target.value})}
                            className="appearance-none bg-slate-200/50 dark:bg-slate-700/50 pl-8 pr-4 py-1.5 rounded-lg text-xs font-medium border-none focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <span className="absolute left-2 top-1.5 material-symbols-rounded text-sm pointer-events-none opacity-60 text-slate-700 dark:text-slate-300">folder</span>
                    </div>
                    <button 
                        onClick={() => setNote({...note, isPinned: !note.isPinned})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${note.isPinned ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200/50 dark:bg-slate-700/50 opacity-60 text-slate-700 dark:text-slate-300'}`}
                    >
                        <span className="material-symbols-rounded text-sm">push_pin</span>
                        {note.isPinned ? 'Pinned' : 'Pin'}
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-slate-400 material-symbols-rounded text-lg">tag</span>
                    {note.tags.map(tag => (
                        <span key={tag} onClick={() => setNote({...note, tags: note.tags.filter(t => t !== tag)})} className="cursor-pointer hover:bg-red-500/20 hover:text-red-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-md text-xs transition-colors">#{tag}</span>
                    ))}
                    <input 
                        type="text" placeholder="Add tag..." value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && tagInput.trim()) {
                                if(!note.tags.includes(tagInput.trim())) {
                                    setNote({...note, tags: [...note.tags, tagInput.trim()]});
                                }
                                setTagInput('');
                            }
                        }}
                        className="bg-transparent text-sm min-w-[80px] outline-none text-slate-600 dark:text-slate-300 placeholder-slate-400"
                    />
                </div>

                {/* Media Gallery */}
                {(note.images.length > 0 || note.drawings.length > 0) && (
                    <div className="flex gap-4 overflow-x-auto pb-4 mb-4 no-scrollbar">
                        {note.images.map((img, idx) => (
                            <div key={'img'+idx} className="relative flex-shrink-0 group">
                                <img src={img} alt="attachment" className="h-40 rounded-xl shadow-md border border-white/10 object-cover" />
                                <button onClick={() => setNote({...note, images: note.images.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))}
                        {note.drawings.map((draw, idx) => (
                            <div key={'draw'+idx} className="relative flex-shrink-0 group bg-white rounded-xl">
                                <img src={draw} alt="drawing" className="h-40 rounded-xl shadow-md border border-white/10" />
                                <button onClick={() => setNote({...note, drawings: note.drawings.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Voice Notes */}
                {note.voiceNotes.map((v, idx) => (
                    <div key={idx} className="mb-3 flex items-center gap-3 bg-slate-200/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-300 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><span className="material-symbols-rounded text-sm">play_arrow</span></div>
                        <audio controls src={v} className="h-8 w-full max-w-[200px]" />
                        <button onClick={() => setNote({...note, voiceNotes: note.voiceNotes.filter((_, i) => i !== idx)})} className="ml-auto text-slate-400 hover:text-red-500"><span className="material-symbols-rounded">delete</span></button>
                    </div>
                ))}

                {/* Editor Area */}
                {note.isChecklist ? (
                    <div className="space-y-2">
                        {note.content.split('\n').map((line, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <input type="checkbox" className="mt-1.5 accent-indigo-500 w-4 h-4" />
                                <input 
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-slate-700 dark:text-slate-300"
                                    value={line}
                                    onChange={(e) => {
                                        const lines = note.content.split('\n');
                                        lines[idx] = e.target.value;
                                        setNote({...note, content: lines.join('\n')});
                                    }}
                                    placeholder="List item..."
                                />
                                <button onClick={() => {
                                    const lines = note.content.split('\n');
                                    lines.splice(idx, 1);
                                    setNote({...note, content: lines.join('\n')});
                                }} className="text-slate-300 hover:text-slate-500">×</button>
                            </div>
                        ))}
                        <button onClick={() => setNote({...note, content: note.content + '\n'})} className="text-sm font-semibold text-indigo-500 mt-2 flex items-center gap-1"><span className="material-symbols-rounded text-sm">add</span> Add Item</button>
                    </div>
                ) : (
                    <textarea
                        className="w-full h-[50vh] bg-transparent resize-none border-none focus:ring-0 p-0 text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600"
                        placeholder="Start writing..."
                        value={note.content}
                        onChange={e => setNote({ ...note, content: e.target.value })}
                    />
                )}
            </div>

            {/* Toolbar */}
            <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/40 backdrop-blur-xl flex justify-around items-center pb-8 safe-area-pb">
                 <div className="relative">
                    <input type="file" accept="image/*" capture="environment" className="hidden" id="camInput" onChange={handleAddImage} />
                    <label htmlFor="camInput" className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700 transition-colors cursor-pointer">
                            <span className="material-symbols-rounded text-2xl">photo_camera</span>
                            <span className="text-[9px] mt-0.5 font-medium">Camera</span>
                    </label>
                </div>
                <div className="relative">
                    <input type="file" accept="image/*" className="hidden" id="imgInput" ref={fileInputRef} onChange={handleAddImage} />
                    <label htmlFor="imgInput" className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700 transition-colors cursor-pointer">
                            <span className="material-symbols-rounded text-2xl">image</span>
                            <span className="text-[9px] mt-0.5 font-medium">Gallery</span>
                    </label>
                </div>
                <button onClick={() => setShowDrawModal(true)} className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700 transition-colors">
                    <span className="material-symbols-rounded text-2xl">draw</span><span className="text-[9px] mt-0.5 font-medium">Draw</span>
                </button>
                <button onClick={toggleRecording} className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700'}`}>
                    <span className="material-symbols-rounded text-2xl">{isRecording ? 'stop' : 'mic'}</span><span className="text-[9px] mt-0.5 font-medium">Voice</span>
                </button>
                <button onClick={() => setNote({...note, isChecklist: !note.isChecklist})} className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-colors ${note.isChecklist ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}>
                    <span className="material-symbols-rounded text-2xl">check_box</span><span className="text-[9px] mt-0.5 font-medium">List</span>
                </button>
            </div>
            
            <DrawingModal isOpen={showDrawModal} onClose={() => setShowDrawModal(false)} onSave={handleSaveDrawing} />
        </div>
    );
};
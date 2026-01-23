import React from 'react';
import { ThemeMode } from '../../types';
import { useI18n } from '../../services/i18n';

interface SettingsViewProps {
    theme: ThemeMode;
    setTheme: (t: ThemeMode) => void;
    onExport: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExportMD: () => void;
    onImportMD: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
    theme, setTheme, onExport, onImport, onExportMD, onImportMD 
}) => {
    const { t, lang, setLang } = useI18n();

    const languages = [
        { code: 'en', name: 'English', icon: '🇺🇸' },
        { code: 'es', name: 'Español', icon: '🇪🇸' },
        { code: 'pt', name: 'Português', icon: '🇧🇷' }
    ] as const;

    return (
        <div className="p-6 h-full overflow-y-auto no-scrollbar pb-32 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-8 text-slate-800 dark:text-white tracking-tight animate-slide-up stagger-1">{t('settings')}</h2>
            
            <div className="grid grid-cols-1 gap-8 max-w-2xl">
                {/* Appearance Section */}
                <div className="glass-panel p-8 rounded-[40px] animate-slide-up stagger-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <span className="material-symbols-rounded text-2xl">palette</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('appearance')}</h3>
                    </div>
                    
                    <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl inline-flex w-full">
                        <button 
                            onClick={() => setTheme('light')} 
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-black transition-all ${theme === 'light' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-rounded">light_mode</span> Light
                        </button>
                        <button 
                            onClick={() => setTheme('dark')} 
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-black transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-xl text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-rounded">dark_mode</span> Dark
                        </button>
                    </div>
                </div>

                {/* Language Section */}
                <div className="glass-panel p-8 rounded-[40px] animate-slide-up stagger-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <span className="material-symbols-rounded text-2xl">language</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('language')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLang(l.code as any)}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all border-2 ${lang === l.code ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-500 hover:border-emerald-500/30'}`}
                            >
                                <span className="text-lg">{l.icon}</span>
                                {l.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Management Section */}
                <div className="glass-panel p-8 rounded-[40px] animate-slide-up stagger-3">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <span className="material-symbols-rounded text-2xl">database</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('dataOps')}</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Markdown Support */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={onExportMD} className="flex items-center gap-4 p-5 rounded-[28px] bg-indigo-500/5 dark:bg-indigo-500/10 border-2 border-transparent hover:border-indigo-500/30 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded">description</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{t('exportMd')}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">.MD BUNDLE</div>
                                </div>
                            </button>
                            <button onClick={onImportMD} className="flex items-center gap-4 p-5 rounded-[28px] bg-purple-500/5 dark:bg-purple-500/10 border-2 border-transparent hover:border-purple-500/30 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded">upload_file</span>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{t('importMd')}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">MARKDOWN</div>
                                </div>
                            </button>
                        </div>

                        <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>

                        {/* JSON Support */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={onExport} className="flex items-center gap-4 p-5 rounded-[28px] bg-slate-500/5 dark:bg-white/5 hover:bg-slate-500/10 dark:hover:bg-white/10 transition-all">
                                <span className="material-symbols-rounded text-slate-400">download</span>
                                <div className="text-left">
                                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Export JSON</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Full Backup</div>
                                </div>
                            </button>
                            <label className="flex items-center gap-4 p-5 rounded-[28px] bg-slate-500/5 dark:bg-white/5 hover:bg-slate-500/10 dark:hover:bg-white/10 transition-all cursor-pointer">
                                <span className="material-symbols-rounded text-slate-400">upload</span>
                                <div className="text-left">
                                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Import JSON</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Restore Data</div>
                                </div>
                                <input type="file" className="hidden" accept=".json" onChange={onImport} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl text-center opacity-30 mt-12 animate-slide-up stagger-4">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Vitreon Notes Elite v2.2</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 mt-2 uppercase">Handcrafted for Performance & Privacy</p>
            </div>
        </div>
    );
};
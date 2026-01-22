import React from 'react';
import { ThemeMode } from '../../types';

interface SettingsViewProps {
    theme: ThemeMode;
    setTheme: (t: ThemeMode) => void;
    onExport: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, onExport, onImport }) => {
    return (
        <div className="p-6 h-full overflow-y-auto pb-24">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Settings</h2>
            
            <div className="glass-card p-6 rounded-2xl mb-6">
                <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-white">Appearance</h3>
                <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl inline-flex">
                    <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}>
                        <span className="material-symbols-rounded text-sm">light_mode</span> Light
                    </button>
                    <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        <span className="material-symbols-rounded text-sm">dark_mode</span> Dark
                    </button>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl mb-6">
                <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-white">Data</h3>
                <div className="space-y-3">
                    <button onClick={onExport} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 transition-colors text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-3"><span className="material-symbols-rounded">download</span><span>Export Backup</span></div>
                    </button>
                    <label className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 transition-colors cursor-pointer text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-3"><span className="material-symbols-rounded">upload</span><span>Import Backup</span></div>
                        <input type="file" className="hidden" accept=".json" onChange={onImport} />
                    </label>
                </div>
            </div>
             <div className="text-center opacity-50 mt-10"><p className="text-xs text-slate-500 dark:text-slate-400">Lumina Notes v2.1</p></div>
        </div>
    );
};
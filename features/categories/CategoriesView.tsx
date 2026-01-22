import React from 'react';
import { Category, Note } from '../../types';

interface CategoriesViewProps {
    categories: Category[];
    notes: Note[];
    onCategoryClick: (cat: Category) => void;
}

const CategoryCard = ({ category, count, onClick }: { category: Category; count: number; onClick: () => void }) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-500/20 text-blue-700 dark:text-blue-200',
        emerald: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-200',
        amber: 'bg-amber-500/20 text-amber-700 dark:text-amber-200',
        purple: 'bg-purple-500/20 text-purple-700 dark:text-purple-200',
        rose: 'bg-rose-500/20 text-rose-700 dark:text-rose-200',
        slate: 'bg-slate-500/20 text-slate-700 dark:text-slate-200',
    };
    const baseClass = colorMap[category.color] || colorMap['slate'];

    return (
        <div onClick={onClick} className={`glass-card rounded-2xl p-5 flex flex-col justify-between aspect-square cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg ${baseClass.split(' ')[0]}`}>
            <div className={`w-10 h-10 rounded-full bg-white/40 flex items-center justify-center ${baseClass.split(' ')[1]}`}>
                <span className="material-symbols-rounded text-xl">{category.icon}</span>
            </div>
            <div>
                <h3 className="text-lg font-bold opacity-90">{category.name}</h3>
                <p className="text-sm opacity-60 font-medium">{count} Notes</p>
            </div>
        </div>
    );
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, notes, onCategoryClick }) => {
    const counts = notes.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-6 h-full overflow-y-auto pb-24">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Collections</h2>
            <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                    <CategoryCard key={cat.id} category={cat} count={counts[cat.id] || 0} onClick={() => onCategoryClick(cat)} />
                ))}
            </div>
        </div>
    );
};
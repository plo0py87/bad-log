import React, { useState, useEffect } from 'react';
import { SkillCategory, getSkills, saveSkillCategory, deleteSkillCategory } from '../../../services/contentService';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function SkillsManagement() {
    const [skills, setSkills] = useState<SkillCategory[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<SkillCategory>>({});

    const loadData = async () => {
        const data = await getSkills();
        setSkills(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!formData.category) return;
        const items = Array.isArray(formData.items) ? formData.items : (formData.items as unknown as string || '').split(',').map(s => s.trim()).filter(Boolean);

        await saveSkillCategory({
            id: editingId === 'new' ? '' : editingId!,
            category: formData.category,
            items: items,
            color: formData.color || 'emerald',
            order: formData.order || skills.length + 1
        });
        setEditingId(null);
        setFormData({});
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this category?')) {
            await deleteSkillCategory(id);
            loadData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Skills Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ color: 'emerald', items: [] }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 transition"
                >
                    <FiPlus /> New Category
                </button>
            </div>

            {(editingId) && (
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category Name</label>
                            <input
                                value={formData.category || ''}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Items (comma separated)</label>
                            <input
                                value={Array.isArray(formData.items) ? formData.items.join(', ') : formData.items}
                                onChange={e => setFormData({ ...formData, items: e.target.value.split(',').map(s => s.trim()) })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                                placeholder="React, TypeScript, Python..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Color (Tailwind class prefix, e.g. emerald, yellow)</label>
                            <input
                                value={formData.color || ''}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 justify-end">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2"><FiX /> Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 flex items-center gap-2"><FiSave /> Save</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white/5 p-4 rounded border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-medium text-${skill.color}-400`}>{skill.category}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingId(skill.id); setFormData(skill); }} className="text-blue-400"><FiEdit2 /></button>
                                <button onClick={() => handleDelete(skill.id)} className="text-red-400"><FiTrash2 /></button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skill.items.map(item => (
                                <span key={item} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

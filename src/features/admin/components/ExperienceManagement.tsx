import React, { useState, useEffect } from 'react';
import { Experience, getExperiences, addExperience, updateExperience, deleteExperience } from '../../../services/contentService';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function ExperienceManagement() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Experience>>({});
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setFormData(exp);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleDelete = async (id: string) => {
        if (confirm('確定要刪除這項經歷嗎？')) {
            await deleteExperience(id);
            loadData();
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.organization) return;

        if (editingId) {
            await updateExperience(editingId, formData);
        } else {
            await addExperience({
                title: formData.title,
                organization: formData.organization,
                duration: formData.duration || '',
                description: formData.description || '',
                type: (formData.type as any) || 'work',
                order: experiences.length + 1
            });
        }
        handleCancel();
        loadData();
    };

    const handleOrderChange = async (id: string, newOrder: number) => {
        await updateExperience(id, { order: newOrder });
        loadData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Experience Management</h2>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ type: 'work' }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 transition"
                >
                    <FiPlus /> New Experience
                </button>
            </div>

            {/* Editor (New/Edit) */}
            {(editingId === 'new' || editingId) && (
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-6">
                    <h3 className="text-lg mb-4 text-emerald-400">{editingId === 'new' ? 'Add New' : 'Edit'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Organization</label>
                            <input
                                value={formData.organization || ''}
                                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Duration</label>
                            <input
                                value={formData.duration || ''}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                value={formData.type || 'work'}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
                            >
                                <option value="education">Education</option>
                                <option value="work">Work</option>
                                <option value="activity">Activity</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white h-24"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 justify-end">
                        <button onClick={handleCancel} className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2"><FiX /> Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 flex items-center gap-2"><FiSave /> Save</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-white/5 p-4 rounded flex justify-between items-center border border-white/10">
                        <div>
                            <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                            <p className="text-sm text-emerald-400">{exp.organization}</p>
                            <p className="text-xs text-gray-500">{exp.duration}</p>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={exp.order}
                                onChange={(e) => handleOrderChange(exp.id, parseInt(e.target.value))}
                                className="w-16 bg-black/30 border border-white/10 rounded p-1 text-center text-white"
                            />
                            <button onClick={() => handleEdit(exp)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><FiTrash2 /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

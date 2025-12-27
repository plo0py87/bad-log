import React, { useState, useEffect } from 'react';
import { HomeInfo, getHomeInfos, updateHomeInfo, getInterests, saveInterests, initializeDefaultContent } from '../../../services/contentService';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

export default function ContentManagement() {
    const [homeInfos, setHomeInfos] = useState<HomeInfo[]>([]);
    const [interests, setInterests] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const info = await getHomeInfos();
        setHomeInfos(info);

        const intData = await getInterests();
        if (intData) {
            setInterests(intData.items.join('\n'));
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleInfoSave = async (id: string, data: HomeInfo) => {
        await updateHomeInfo(id, data);
        alert('Saved!');
    };

    const handleInterestSave = async () => {
        const items = interests.split('\n').filter(s => s.trim());
        await saveInterests({ items, note: '' });
        alert('Interests Saved!');
    };

    const handleInitDefaults = async () => {
        if (confirm("This will initialize default content if missing. Continue?")) {
            await initializeDefaultContent();
            loadData();
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-12">

            {/* Home Info Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Homepage Columns</h2>
                    <button onClick={handleInitDefaults} className="text-sm text-emerald-400 flex items-center gap-1"><FiRefreshCw /> Init Defaults</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {homeInfos.map((info) => (
                        <div key={info.id} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Title</label>
                                <input
                                    value={info.title}
                                    onChange={(e) => {
                                        const newInfos = homeInfos.map(i => i.id === info.id ? { ...i, title: e.target.value } : i);
                                        setHomeInfos(newInfos);
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded p-1 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Color (emerald/yellow/red)</label>
                                <select
                                    value={info.accentColor}
                                    onChange={(e) => {
                                        const newInfos = homeInfos.map(i => i.id === info.id ? { ...i, accentColor: e.target.value } : i);
                                        setHomeInfos(newInfos);
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded p-1 text-white"
                                >
                                    <option value="emerald">Emerald</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="red">Red</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Content</label>
                                <textarea
                                    value={info.content}
                                    onChange={(e) => {
                                        const newInfos = homeInfos.map(i => i.id === info.id ? { ...i, content: e.target.value } : i);
                                        setHomeInfos(newInfos);
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded p-1 text-white h-32 text-sm"
                                />
                            </div>
                            <button
                                onClick={() => handleInfoSave(info.id, info)}
                                className="w-full py-2 bg-emerald-600/50 hover:bg-emerald-600 rounded text-sm flex items-center justify-center gap-2"
                            >
                                <FiSave /> Save
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white mb-6">Interests List</h2>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <label className="block text-sm text-gray-400 mb-2">One item per line</label>
                    <textarea
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="w-full h-48 bg-black/50 border border-white/10 rounded p-4 text-white font-mono"
                        placeholder="C++&#10;Python&#10;Singing"
                    />
                    <div className="flex justify-end mt-4">
                        <button onClick={handleInterestSave} className="px-6 py-2 bg-emerald-600 rounded hover:bg-emerald-700 flex items-center gap-2"><FiSave /> Save Interests</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

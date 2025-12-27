import React, { useEffect, useState } from 'react';
import { usePageViews } from '../hooks/usePageViews';

import { getAllPosts } from '../services/blogService';
import { getExperiences, getSkills, getHomeInfos, Experience, SkillCategory, HomeInfo } from '../services/contentService';
import { db } from '../firebase';
import { FaLeaf } from 'react-icons/fa';
import AsciiBackground from '../components/ui/AsciiBackground';

// Safe color lookup to prevent Tailwind purging
const COLOR_VARIANTS: Record<string, {
    title: string;
    marker: string;
    infoTitle: string;
}> = {
    emerald: { title: 'text-emerald-300', marker: 'marker:text-emerald-500', infoTitle: 'text-emerald-400' },
    yellow: { title: 'text-yellow-300', marker: 'marker:text-yellow-500', infoTitle: 'text-yellow-400' },
    red: { title: 'text-red-300', marker: 'marker:text-red-500', infoTitle: 'text-red-400' },
    blue: { title: 'text-blue-300', marker: 'marker:text-blue-500', infoTitle: 'text-blue-400' },
    indigo: { title: 'text-indigo-300', marker: 'marker:text-indigo-500', infoTitle: 'text-indigo-400' },
    purple: { title: 'text-purple-300', marker: 'marker:text-purple-500', infoTitle: 'text-purple-400' },
    pink: { title: 'text-pink-300', marker: 'marker:text-pink-500', infoTitle: 'text-pink-400' },
    orange: { title: 'text-orange-300', marker: 'marker:text-orange-500', infoTitle: 'text-orange-400' },
};

export default function AsciiHomePage() {
    // Dashboard Stats
    const { viewCount, loading: statsLoading, error: statsError } = usePageViews();
    const [totalArticles, setTotalArticles] = useState(0);

    // Dynamic Content
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<SkillCategory[]>([]);
    const [homeInfos, setHomeInfos] = useState<HomeInfo[]>([]);

    useEffect(() => {
        async function loadContent() {
            const [expData, skillData, infoData] = await Promise.all([
                getExperiences(),
                getSkills(),
                getHomeInfos()
            ]);
            setExperiences(expData);
            setSkills(skillData);
            setHomeInfos(infoData);
        }
        loadContent();
    }, []);

    useEffect(() => {
        async function fetchTotalArticles() {
            try {
                const posts = await getAllPosts();
                setTotalArticles(posts.length);
            } catch (err) {
                console.error("Error fetching total articles:", err);
            }
        }
        fetchTotalArticles();
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-black overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
            <AsciiBackground />

            {/* Main Content Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 md:p-12 pb-32">

                {/* Title */}
                <div className="mb-24 text-center mt-20">
                    <span className="block text-emerald-300/30 tracking-[0.5em] text-sm mb-4 uppercase">Tech &bull; Mind &bull; Music</span>
                    <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Shine Chen's Blog<span className="text-emerald-500"></span>
                    </h1>
                </div>

                {/* Info Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-white/80 max-w-7xl">
                    {homeInfos.length > 0 ? homeInfos.map((info) => {
                        const colors = COLOR_VARIANTS[info.accentColor] || COLOR_VARIANTS['emerald'];
                        return (
                            <div key={info.id} className="space-y-4 backdrop-blur-sm bg-black/20 p-6 rounded-lg border border-white/5 hover:bg-black/40 transition-colors">
                                <h3 className={`text-xl font-light ${colors.infoTitle} tracking-wider`}>{info.title}</h3>
                                <p className="text-sm leading-relaxed font-light text-gray-300 whitespace-pre-line">
                                    {info.content}
                                </p>
                            </div>
                        )
                    }) : (
                        // Fallback/Default Content if no data loaded yet (prevents flicker of empty space before data comes in if initialized)
                        <>
                            <div className="space-y-4 backdrop-blur-sm bg-black/20 p-6 rounded-lg border border-white/5 hover:bg-black/40 transition-colors">
                                <h3 className="text-xl font-light text-emerald-400 tracking-wider">What I Do</h3>
                                <p className="text-sm leading-relaxed font-light text-gray-300">Loading...</p>
                            </div>
                        </>
                    )}
                </div>

                {/* === MERGED ABOUT CONTENT === */}
                <div className="w-full mt-32 space-y-24 pb-20 max-w-7xl">

                    {/* Dashboard Stats */}
                    <div>
                        <h2 className="text-3xl font-light text-white tracking-widest text-center mb-12 drop-shadow-md">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="backdrop-blur-sm bg-black/40 border border-white/5 p-8 rounded-xl flex flex-col items-center">
                                <h3 className="text-lg font-light text-emerald-400 mb-4 tracking-wider">瀏覽次數</h3>
                                {statsLoading ? (
                                    <span className="text-white/40">Loading...</span>
                                ) : statsError ? (
                                    <span className="text-red-400">Error</span>
                                ) : (
                                    <div className="text-4xl font-mono text-white/90">
                                        {viewCount.toString().padStart(6, '0')}
                                        <span className="text-sm text-white/40 ml-2">Views</span>
                                    </div>
                                )}
                            </div>
                            <div className="backdrop-blur-sm bg-black/40 border border-white/5 p-8 rounded-xl flex flex-col items-center">
                                <h3 className="text-lg font-light text-yellow-400 mb-4 tracking-wider">上線天數</h3>
                                <div className="text-4xl font-mono text-white/90">
                                    {Math.floor((new Date().getTime() - new Date('2025-04-08').getTime()) / (1000 * 60 * 60 * 24)).toString().padStart(3, '0')}
                                    <span className="text-sm text-white/40 ml-2">Days</span>
                                </div>
                            </div>
                            <div className="backdrop-blur-sm bg-black/40 border border-white/5 p-8 rounded-xl flex flex-col items-center">
                                <h3 className="text-lg font-light text-red-400 mb-4 tracking-wider">文章總數</h3>
                                <div className="text-4xl font-mono text-white/90">
                                    {totalArticles.toString().padStart(3, '0')}
                                    <span className="text-sm text-white/40 ml-2">Posts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Experience */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Skills */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-light text-white tracking-widest mb-8 border-b border-white/10 pb-4">Skills & Interests</h2>

                            {skills.map((skill) => {
                                const colors = COLOR_VARIANTS[skill.color] || COLOR_VARIANTS['emerald'];
                                return (
                                    <div key={skill.id} className="backdrop-blur-sm bg-white/5 border border-white/5 p-6 rounded-lg">
                                        <h3 className={`text-lg ${colors.title} font-light mb-4 flex items-center gap-2`}>
                                            {skill.category.includes('Interest') && <FaLeaf />} {skill.category}
                                        </h3>
                                        <ul className={`grid ${skill.items.length > 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 text-sm text-gray-300 font-light pl-4 list-disc ${colors.marker}`}>
                                            {skill.items.map(item => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Experience */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-light text-white tracking-widest mb-8 border-b border-white/10 pb-4">Experience</h2>

                            <div className="relative border-l border-white/20 pl-8 space-y-10 ml-4">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative">
                                        <div className={`absolute -left-[38px] top-1.5 h-3 w-3 ${exp.type === 'education' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/30'} rounded-full`}></div>
                                        <h3 className="text-xl font-light text-white">{exp.title}</h3>
                                        <p className="text-emerald-400/60 text-sm mb-2">{exp.duration}</p>
                                        <p className="text-gray-400 font-light">{exp.organization}</p>
                                        {exp.description && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Contact Mini */}
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <h3 className="text-lg font-light text-white mb-4">Contact</h3>
                                <p className="text-gray-400 font-light mb-2">ploopy0408@gmail.com</p>
                                <div className="flex gap-4 opacity-70">
                                    {/* Icons would go here, simplifying for clean layout */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState, useRef } from 'react';

const ASCII_URLS = [
    '/ascii-art.txt',
    '/ascii-art (1).txt',
    '/ascii-art (2).txt',
    '/ascii-art (3).txt'
];

interface AsciiBackgroundProps {
    className?: string;
}

export default function AsciiBackground({ className = '' }: AsciiBackgroundProps) {
    const [asciiArts, setAsciiArts] = useState<string[]>([]);
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load and normalize ASCII arts
    useEffect(() => {
        const loadArts = async () => {
            try {
                const texts = await Promise.all(
                    ASCII_URLS.map(url => fetch(url).then(res => res.text()))
                );

                // Determine max dimensions
                const dimensions = texts.map(text => {
                    const lines = text.split('\n');
                    const height = lines.length;
                    // Trim carriage returns and find max width
                    const width = Math.max(...lines.map(line => line.replace(/\r$/, '').length));
                    return { width, height };
                });

                const maxWidth = Math.max(...dimensions.map(d => d.width));
                const maxHeight = Math.max(...dimensions.map(d => d.height));

                // Normalize with CENTER padding
                const normalizedTexts = texts.map(text => {
                    const lines = text.split('\n');
                    const paddedLines = lines.map(rawLine => {
                        const line = rawLine.replace(/\r$/, '');
                        const padding = maxWidth - line.length;
                        const leftPad = Math.floor(padding / 2);
                        const rightPad = padding - leftPad;
                        return ' '.repeat(leftPad) + line + ' '.repeat(rightPad);
                    });
                    while (paddedLines.length < maxHeight) {
                        paddedLines.push(' '.repeat(maxWidth));
                    }
                    return paddedLines.join('\n');
                });

                setAsciiArts(normalizedTexts);
                setDisplayedText(normalizedTexts[0]);
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to load ASCII art:', error);
            }
        };

        loadArts();
    }, []);

    // Radial Flipping Animation
    useEffect(() => {
        if (!isLoaded || asciiArts.length === 0) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % asciiArts.length;
            const currentArt = asciiArts[currentIndex];
            const nextArt = asciiArts[nextIndex];

            // Random center point for the spread
            const rows = currentArt.split('\n');
            const height = rows.length;
            const width = rows[0].length;
            const centerX = Math.floor(Math.random() * width);
            const centerY = Math.floor(Math.random() * height);
            const maxDist = Math.sqrt(width * width + height * height);

            let startTime: number | null = null;
            const duration = 2000; // 2 seconds transition

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / duration;

                if (progress >= 1) {
                    setDisplayedText(nextArt);
                    setCurrentIndex(nextIndex);
                    return;
                }

                const currentRadius = maxDist * progress;

                const frameText = rows.map((row, y) => {
                    return row.split('').map((char, x) => {
                        const dx = x - centerX;
                        const dy = (y - centerY) * 2; // Correct aspect ratio roughly
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Clean radial spread without noise band
                        if (dist < currentRadius) {
                            const nextRow = nextArt.split('\n')[y];
                            return nextRow ? nextRow[x] : char;
                        }

                        return char;
                    }).join('');
                }).join('\n');

                setDisplayedText(frameText);
                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);

        }, 8000); // Change every 8 seconds

        return () => clearInterval(interval);
    }, [currentIndex, isLoaded, asciiArts]);

    // Lights
    const mousePos = useRef({ x: 0, y: 0 });
    const [light1, setLight1] = useState({ x: 20, y: 20, scale: 1, opacity: 0.4 });
    const [light2, setLight2] = useState({ x: 80, y: 60, scale: 1, opacity: 0.4 });
    const [light3, setLight3] = useState({ x: 50, y: 40, scale: 1, opacity: 0.4 }); // Yellow light

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let frameId: number;
        let time = 0;

        const animateLights = () => {
            time += 0.005;

            // Breathing effect
            const breathe1 = 1 + Math.sin(time * 2) * 0.15;
            const breathe2 = 1 + Math.cos(time * 1.5) * 0.15;
            const breathe3 = 1 + Math.sin(time * 1.8 + 2) * 0.15;

            const opacity1 = 0.3 + Math.sin(time * 1) * 0.1;
            const opacity2 = 0.3 + Math.cos(time * 0.8) * 0.1;
            const opacity3 = 0.3 + Math.sin(time * 1.2 + 1) * 0.1;

            // Movement - Reduced mouse influence for subtlety
            setLight1({
                x: 20 + Math.sin(time) * 15 + (mousePos.current.x * 20),
                y: 20 + Math.cos(time * 1.2) * 15 + (mousePos.current.y * 20),
                scale: breathe1,
                opacity: opacity1
            });

            setLight2({
                x: 80 + Math.cos(time * 0.8) * 15 - (mousePos.current.x * 25),
                y: 60 + Math.sin(time) * 15 - (mousePos.current.y * 25),
                scale: breathe2,
                opacity: opacity2
            });

            setLight3({
                x: 50 + Math.sin(time * 1.1 + 1) * 20 + (mousePos.current.x * 15),
                y: 80 + Math.cos(time * 0.9 + 2) * 20 + (mousePos.current.y * 15),
                scale: breathe3,
                opacity: opacity3
            });

            frameId = requestAnimationFrame(animateLights);
        };

        animateLights();
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Scroll Parallax
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className} `}>
            {/* Background Gradient Base */}
            <div className="absolute inset-0 bg-black"></div>

            {/* Interactive Lights */}
            <div
                className="absolute transition-transform duration-100 ease-linear rounded-full blur-[120px] mix-blend-screen bg-emerald-600/50 will-change-transform"
                style={{
                    left: `${light1.x}%`,
                    top: `${light1.y}%`,
                    transform: `translate(-50%, -50%) scale(${light1.scale})`,
                    width: '50vw',
                    height: '50vw',
                    opacity: light1.opacity
                }}
            />
            <div
                className="absolute transition-transform duration-100 ease-linear rounded-full blur-[120px] mix-blend-screen bg-red-600/50 will-change-transform"
                style={{
                    left: `${light2.x}%`,
                    top: `${light2.y}%`,
                    transform: `translate(-50%, -50%) scale(${light2.scale})`,
                    width: '50vw',
                    height: '50vw',
                    opacity: light2.opacity
                }}
            />
            <div
                className="absolute transition-transform duration-100 ease-linear rounded-full blur-[120px] mix-blend-screen bg-yellow-600/40 will-change-transform"
                style={{
                    left: `${light3.x}%`,
                    top: `${light3.y}%`,
                    transform: `translate(-50%, -50%) scale(${light3.scale})`,
                    width: '40vw',
                    height: '40vw',
                    opacity: light3.opacity
                }}
            />

            {/* ASCII Layer */}
            <div
                className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-plus-lighter pointer-events-none will-change-transform"
                style={{
                    transform: `translateY(-${scrollY * 0.15}px)`
                }}
            >
                <pre className="text-[6px] leading-[6px] md:text-[8px] md:leading-[8px] font-mono text-white/60 whitespace-pre overflow-hidden select-none">
                    {displayedText}
                </pre>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 pointer-events-none"></div>
        </div>
    );
}

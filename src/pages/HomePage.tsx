import * as React from 'react';
import FloatingDots from '../components/ui/FloatingDots';

type SceneDefinition = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  charSet: string;
  width: number;
  contrast: number;
  accent: string;
};

type SceneAsciiMap = Record<string, string>;

const SCENES: SceneDefinition[] = [
  {
    id: 'profile-core',
    label: 'MEDTECH STUDENT',
    title: '醫學工程 ╳ 全端開發',
    description:
      '我在醫學工程領域磨練系統思維，熱衷把人體與設備的互動化為可程式化的邏輯，並將這股理解延伸到全端開發中，串起資料、介面與臨床情境。',
    image: '/profile.jpg',
    charSet: '@#MW%8&$XO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,. ',
    width: 140,
    contrast: 1.35,
    accent: 'from-emerald-500/40 to-slate-900/80',
  },
  {
    id: 'security',
    label: 'CYBER INSIGHT',
    title: '資訊資安 ╳ 風險思維',
    description:
      '熟悉攻防研究與威脅建模，理解系統邏輯如何被突破，並用這份敏銳洞察打造更安全、有韌性的應用服務。',
    image: '/profile.jpg',
    charSet: '@%#*+=-:. ',
    width: 120,
    contrast: 1.6,
    accent: 'from-emerald-400/30 to-zinc-900/90',
  },
  {
    id: 'neuro',
    label: 'NEURO CURIOUS',
    title: '神經腦科學 ╳ 心理學',
    description:
      '著迷於腦神經訊號如何形塑認知與情緒，將心理學的洞見融入設計流程，讓產品不只好用，更能理解人。',
    image: '/profile.jpg',
    charSet: '█▓▒░ .',
    width: 100,
    contrast: 1.2,
    accent: 'from-emerald-300/20 to-black/70',
  },
  {
    id: 'music',
    label: 'SONIC SPACE',
    title: '吉他 ╳ 主唱 ╳ 設計節奏',
    description:
      '在音樂裡找尋節奏與張力，學會如何建構情緒流動，把這份律動感灌輸進設計與敘事之中。',
    image: '/profile.jpg',
    charSet: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,. ',
    width: 130,
    contrast: 1.45,
    accent: 'from-emerald-500/35 to-slate-950/90',
  },
  {
    id: 'systems',
    label: 'SYSTEM THINKING',
    title: '洞察 ╳ 問題解構',
    description:
      '無論是醫療設備、雲端架構或團隊溝通，我喜歡拆解複雜系統，重新組出優雅且可持續的解決方案。',
    image: '/profile.jpg',
    charSet: '@WM%#*+=-:. ',
    width: 115,
    contrast: 1.5,
    accent: 'from-emerald-600/40 to-slate-950/80',
  },
];

export default function HomePage() {
  // 暫時簡化狀態管理
  // 暫時簡化狀態管理
  const [activeScene, setActiveScene] = React.useState<string>(SCENES[0]?.id ?? '');
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);
  const asciiMap = useAsciiScenes(SCENES);

  React.useEffect(() => {
    if (sectionRefs.current.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const sceneId = visible[0].target.getAttribute('data-scene-id');
          if (sceneId) {
            setActiveScene(sceneId);
          }
        }
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0.2, 0.35, 0.5, 0.75],
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Hero />

      <section className="relative min-h-screen overflow-hidden border-y border-white/5">
        <BackgroundTexture intensity="soft" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24 md:px-10 lg:flex-row lg:gap-24 lg:py-32">
          <div className="relative lg:sticky lg:top-32 lg:h-[70vh] lg:min-h-[32rem] lg:w-[52%]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-emerald-900/30 opacity-60 blur-3xl" />
            <div className="relative h-full rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-emerald-200/70">
                <span>文字矩陣成像</span>
                <span className="text-white/60">Scroll to decode</span>
              </div>

              <div className={`relative h-full overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${getSceneAccent(activeScene)}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,30,24,0.8),_transparent_65%)]" />
                <div className="relative h-full overflow-y-hidden p-4">
                  <pre className="h-full w-full whitespace-pre text-[0.42rem] leading-[0.55rem] text-emerald-100/80 drop-shadow-[0_0_18px_rgba(16,255,187,0.4)] sm:text-[0.55rem] sm:leading-[0.65rem] md:text-[0.6rem] md:leading-[0.72rem]">
                    {asciiMap[activeScene] || `
██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
██████████████████████████████████████████████████▓▓▒▒░░░░░░▒▒▓▓████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████▓▒░░        ░░▒▓██████████████████████████████████████████████████████████████████████
██████████████████████████████████████████████▓▒░              ░▒▓████████████████████████████████████████████████████████████████████
████████████████████████████████████████████▓▒░                  ░▒▓██████████████████████████████████████████████████████████████████
██████████████████████████████████████████▓▒░                      ░▒▓████████████████████████████████████████████████████████████████
████████████████████████████████████████▓▒░                          ░▒▓██████████████████████████████████████████████████████████████
██████████████████████████████████████▓▒░                              ░▒▓████████████████████████████████████████████████████████████
████████████████████████████████████▓▒░                                  ░▒▓██████████████████████████████████████████████████████████
██████████████████████████████████▓▒░                                      ░▒▓████████████████████████████████████████████████████████
████████████████████████████████▓▒░                                          ░▒▓██████████████████████████████████████████████████████
██████████████████████████████▓▒░                                              ░▒▓████████████████████████████████████████████████████
████████████████████████████▓▒░                                                  ░▒▓██████████████████████████████████████████████████
██████████████████████████▓▒░                                                      ░▒▓████████████████████████████████████████████████
████████████████████████▓▒░                                                          ░▒▓██████████████████████████████████████████████
██████████████████████▓▒░                                                              ░▒▓████████████████████████████████████████████
████████████████████▓▒░                                                                  ░▒▓██████████████████████████████████████████
██████████████████▓▒░                                                                      ░▒▓████████████████████████████████████████
████████████████▓▒░                                                                          ░▒▓██████████████████████████████████████
██████████████▓▒░                                                                              ░▒▓████████████████████████████████████`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-20">
            {SCENES.map((scene, index) => (
              <article
                key={scene.id}
                ref={(element) => {
                  sectionRefs.current[index] = element;
                }}
                data-scene-id={scene.id}
                className="group relative flex flex-col gap-6 rounded-3xl border border-white/5 bg-black/40 p-8 transition-transform duration-700 hover:-translate-y-1 hover:bg-black/55"
              >
                <span className="text-xs tracking-[0.35em] text-emerald-200/80">{scene.label}</span>
                <h3 className="text-2xl font-light tracking-[0.08em] text-white/95 md:text-3xl">
                  {scene.title}
                </h3>
                <p className="text-base leading-relaxed text-white/75 md:text-lg">
                  {scene.description}
                </p>
                <span
                  className={`absolute inset-x-6 bottom-4 h-px origin-left scale-x-0 bg-gradient-to-r ${scene.accent} transition-transform duration-700 ease-out group-hover:scale-x-100`}
                  aria-hidden
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-32">
        <BackgroundTexture intensity="dense" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-16 px-6 md:px-12">
          <div className="flex flex-col gap-4 text-left md:text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">about me</span>
            <h2 className="text-3xl font-light tracking-[0.12em] text-white/90 md:text-4xl">
              平衡理性與感性的全方位創作者
            </h2>
            <p className="text-base leading-relaxed text-white/70 md:text-lg">
              在醫學工程的訓練中，我重視實證、準確與安全；在全端開發與資安研究裡，我追求架構的彈性與穩定；
              在神經科學、心理學與音樂的探索中，我學會以人為中心，傾聽真正的需求。這些跨域的聲音讓我習慣
              站在系統的全貌上，看清楚每個細節如何影響整體體驗。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard
              title="洞察 × 思考"
              body="面對複雜問題，我習慣先拆解路徑、找出環節的因果關係，再以清晰的流程與視覺語言串起解方。"
              footer="系統性分析、敏感的直覺"
            />
            <InfoCard
              title="技術 × 實踐"
              body="從前端互動到後端雲端部署，都能親手打造；也懂得兼顧資安與使用者體驗，讓作品既精緻又可靠。"
              footer="Full-Stack、Infosec、UX Motion"
            />
            <InfoCard
              title="人體 × 科技"
              body="研究醫療儀器與數據分析，著迷於如何把複雜訊號翻成可理解的語言，最終改善臨床決策。"
              footer="Bio-signal、Data Craft"
            />
            <InfoCard
              title="舞台 × 故事"
              body="作為主唱與吉他手，我享受把故事用聲響演繹，這也成為我在產品敘事與品牌塑造上的靈感來源。"
              footer="Narrative Design、Stage Presence"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-emerald-950/40" />
        <BackgroundTexture intensity="minimal" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-[1.1fr_1fr] md:px-12">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.35em] text-emerald-200/60">current focus</span>
            <h3 className="text-3xl font-light tracking-[0.08em] text-white/90 md:text-4xl">
              將醫療與資訊的邊界推得更遠
            </h3>
            <p className="text-base leading-relaxed text-white/70">
              我正專注於探討如何在醫療系統中導入更安全的雲端架構與資料流程，並為未來的腦神經介面應用預先
              建立友善的使用者體驗。透過跨領域的合作，我希望用可靠的技術與富有感知力的設計，讓科技真正照顧到人。
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-emerald-200/80">
              <span className="rounded-full border border-white/10 px-4 py-2 bg-black/40">MedTech Product</span>
              <span className="rounded-full border border-white/10 px-4 py-2 bg-black/40">Secure Cloud</span>
              <span className="rounded-full border border-white/10 px-4 py-2 bg-black/40">Neuro UX</span>
              <span className="rounded-full border border-white/10 px-4 py-2 bg-black/40">Creative Story</span>
            </div>
          </div>

          <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-md">
            <h4 className="text-lg uppercase tracking-[0.3em] text-emerald-200/80">signature traits</h4>
            <dl className="grid gap-6">
              <Trait title="跨域語言" description="能在醫療專家與工程團隊間流暢轉換語言，確保資訊完整無縫。" />
              <Trait title="沉浸互動" description="擅長運用動畫與節奏打造沉浸感，讓複雜內容更易理解。" />
              <Trait title="安全底線" description="以資安思維審視每個決策，提前防範系統風險。" />
              <Trait title="深度反思" description="透過日誌與音樂創作持續內省，維持創意與專注的最佳平衡。" />
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* 簡化版本的背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-emerald-950/40" />

      {/* 使用更簡單的 FloatingDots 參數 */}
      <div className="absolute inset-0 opacity-60" aria-hidden>
        <FloatingDots
          count={12}
          minRadius={1}
          maxRadius={2}
          color="rgba(109, 255, 190, 0.5)"
          minSpeed={0.2}
          maxSpeed={0.5}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(38,77,58,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(12,130,92,0.15),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <span className="text-xs uppercase tracking-[0.6em] text-emerald-200/80">personal index</span>
        <h1 className="text-4xl font-light tracking-[0.18em] text-white/95 md:text-6xl">
          把醫學工程與科技想像，交織成質感的生活方式
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          我是就讀醫學工程的全端開發者，對資訊資安、神經腦科學與心理學懷抱好奇，也在音樂裡練習情感的共鳴。
          歡迎進入我的個人宇宙，從 ASCII 文字矩陣開始，探索我如何將理性與感性融為一體。
        </p>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
          <span>medtech</span>
          <span className="h-px w-8 bg-emerald-200/40" aria-hidden />
          <span>full-stack</span>
          <span className="h-px w-8 bg-emerald-200/40" aria-hidden />
          <span>music</span>
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 text-[0.7rem] uppercase tracking-[0.35em] text-white/50">
          <span>scroll</span>
          <span className="inline-flex h-12 w-px animate-pulse rounded-full bg-gradient-to-b from-white/40 to-emerald-500/50" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, body, footer }: { title: string; body: string; footer: string }) {
  return (
    <div className="relative flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-black/50 p-8 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 hover:bg-black/60">
      <h3 className="text-lg font-medium tracking-[0.18em] text-emerald-200/90">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-white/70 md:text-base">{body}</p>
      <span className="text-xs uppercase tracking-[0.3em] text-white/40">{footer}</span>
      <span className="absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" aria-hidden />
    </div>
  );
}

function Trait({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-l border-white/10 pl-4">
      <dt className="text-sm uppercase tracking-[0.25em] text-emerald-200/75">{title}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-white/70">{description}</dd>
    </div>
  );
}

function BackgroundTexture({ intensity = 'soft' }: { intensity?: 'soft' | 'dense' | 'minimal' }) {
  const opacityMap: Record<string, string> = {
    soft: 'opacity-[0.25] md:opacity-[0.18]',
    dense: 'opacity-[0.35] md:opacity-[0.28]',
    minimal: 'opacity-[0.18] md:opacity-[0.12]',
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(24,42,35,0.35)_1px,transparent_1px)] bg-[size:120px_120px] ${opacityMap[intensity] ?? opacityMap.soft
        }`}
      aria-hidden
    />
  );
}

function useAsciiScenes(scenes: SceneDefinition[]): SceneAsciiMap {
  const sceneKey = React.useMemo(
    () =>
      scenes
        .map((scene) => `${scene.id}:${scene.image}:${scene.charSet}:${scene.width}:${scene.contrast}`)
        .join('|'),
    [scenes]
  );

  const [asciiMap, setAsciiMap] = React.useState<SceneAsciiMap>({});

  React.useEffect(() => {
    let cancelled = false;

    async function renderScenes() {
      const entries = await Promise.all(
        scenes.map(async (scene) => {
          try {
            const ascii = await convertImageToAscii(scene.image, scene.width, scene.charSet, scene.contrast);
            return [scene.id, ascii] as const;
          } catch (error) {
            console.error('產生 ASCII 影像時發生錯誤:', error);
            return [scene.id, '無法載入圖片'] as const;
          }
        })
      );

      if (!cancelled) {
        setAsciiMap(Object.fromEntries(entries));
      }
    }

    if (typeof window !== 'undefined') {
      renderScenes();
    }

    return () => {
      cancelled = true;
    };
  }, [sceneKey, scenes]);

  return asciiMap;
}

async function convertImageToAscii(
  src: string,
  width: number,
  charset: string,
  contrast: number
): Promise<string> {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas 2D context is not available');
  }

  const aspectRatio = image.height / image.width;
  const height = Math.max(12, Math.round(width * aspectRatio * 0.52));

  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const characters = charset && charset.length > 0 ? charset : '@%#*+=-:. ';

  let ascii = '';

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const normalized = adjustContrast(luminance / 255, contrast);
      const index = Math.min(
        characters.length - 1,
        Math.max(0, Math.round((1 - normalized) * (characters.length - 1)))
      );
      line += characters[index];
    }
    ascii += `${line}\n`;
  }

  return ascii;
}

function adjustContrast(value: number, contrast: number) {
  const factor = Math.max(0.1, contrast);
  return clamp((value - 0.5) * factor + 0.5, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = (event) => reject(event);
    image.src = src;
  });
}

function getSceneAccent(sceneId: string) {
  const scene = SCENES.find((item) => item.id === sceneId);
  return scene?.accent ?? 'from-emerald-500/30 to-black/80';
}

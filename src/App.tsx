import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Pause, Play, X } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback, ReactNode } from "react";

const WALLET_ADDRESS = "FBXSuVueW9Z1U2RmgmYazAX1GGdzay75AKHD9ijJpszq";
const FALLBACK_BALANCE = 34.0001;

interface ShowcaseItem {
  src: string;
  artist: string;
  handle: string;
  socialUrl: string;
  socialType: "twitter" | "instagram";
  avatar: string;
  bgStart?: number; // seconds — where background preview starts (default 0)
  tool?: string; // e.g. "Deforum", "ComfyUI", "Wan" — shown as "With X"
  poster?: string; // poster image shown while video loads
}

const SHOWCASE: ShowcaseItem[] = [
  {
    src: "/datavoid.mp4",
    artist: "Datavoid",
    handle: "@DataPlusEngine",
    socialUrl: "https://x.com/DataPlusEngine",
    socialType: "twitter",
    avatar: "/datavoid.jpg",
    poster: "/datavoid_poster.jpg",
  },
  {
    src: "/visualfrisson.mp4",
    artist: "Visual Frisson",
    handle: "@visualfrisson",
    socialUrl: "https://x.com/visualfrisson",
    socialType: "twitter",
    avatar: "/visualfrisson.jpg",
    poster: "/visualfrisson_poster.jpg",
    tool: "AnimateDiff",
  },
  {
    src: "/emmacatnip.mp4",
    artist: "Emma Catnip",
    handle: "@emmacatnip",
    socialUrl: "https://x.com/emmacatnip",
    socialType: "twitter",
    avatar: "/emmacatnip.jpg",
    poster: "/emmacatnip_poster.jpg",
    tool: "HotshotXL",
  },
  {
    src: "/hannah_submarine.mp4",
    artist: "Hannah Submarine",
    handle: "@hannahsubmarine",
    socialUrl: "https://x.com/hannahsubmarine",
    socialType: "twitter",
    avatar: "/hannah_submarine.jpg",
    poster: "/hannah_submarine_poster.jpg",
    bgStart: 5,
    tool: "LTX1",
  },
  {
    src: "/_ArtOnTap.mp4",
    artist: "ArtOnTap",
    handle: "@_ArtOnTap",
    socialUrl: "https://x.com/_ArtOnTap",
    socialType: "twitter",
    avatar: "/_ArtOnTap.jpg",
    poster: "/_ArtOnTap_poster.jpg",
    tool: "Deforum",
    bgStart: 5,
  },
  {
    src: "/flipping_sigmas.mp4",
    artist: "Flipping Sigmas",
    handle: "@FlippingSigmas",
    socialUrl: "https://x.com/FlippingSigmas/",
    socialType: "twitter",
    avatar: "/flipping_sigmas.jpg",
    poster: "/flipping_sigmas_poster.jpg",
    tool: "WarpFusion",
    bgStart: 3,
  },
  {
    src: "/machine_delusions.mp4",
    artist: "Machine Delusions",
    handle: "@Machinedelusion",
    socialUrl: "https://x.com/Machinedelusion",
    socialType: "twitter",
    avatar: "/machine_delusions.jpg",
    poster: "/machine_delusions_poster.jpg",
    tool: "AnimateLCM",
    bgStart: 2,
  },
];

export default function App() {
  const [balance, setBalance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const rpcRes = await fetch("https://solana-rpc.publicnode.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0", id: 1, method: "getBalance",
            params: [WALLET_ADDRESS],
          }),
        });
        if (rpcRes.ok) {
          const rpcData = await rpcRes.json();
          if (rpcData.result) setBalance(rpcData.result.value / 1e9);
        }

        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        if (res.ok) {
          const data = await res.json();
          setPrice(data.solana.usd);
        }
      } catch (e) {
        console.error("Error fetching funds:", e);
      }
    };

    fetchFunds();
    const interval = setInterval(fetchFunds, 60000);
    return () => clearInterval(interval);
  }, []);

  const sol = balance ?? FALLBACK_BALANCE;
  const usd = price ? (sol * price).toLocaleString("en-US", { style: "currency", currency: "USD" }) : null;

  return (
    <div className="min-h-screen md:h-screen scanlines grain relative md:overflow-hidden overflow-auto flex flex-col">
      {/* Preload all profile pictures */}
      {SHOWCASE.map((s) => s.avatar.startsWith("/") ? <link key={s.avatar} rel="preload" as="image" href={s.avatar} /> : null)}
      <VideoShowcase>
        {(showcaseControls) => (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 md:h-full flex flex-col md:overflow-hidden"
      >
        <header className="border-b border-white/8 px-5 md:px-10 py-3 md:py-4 flex justify-between items-center">
          <h1 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
            ArtCompute
          </h1>
          <ArtistBadge {...showcaseControls} />
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 md:overflow-hidden">
          {/* Left: Hero */}
          <div className="flex-1 px-5 md:px-12 py-5 md:py-0 md:flex md:flex-col md:justify-center md:border-r border-white/8">
            <section>
              <h2 className="font-serif text-2xl md:text-4xl font-normal leading-tight text-white/95 tracking-tight">
                Micro Grants for<br />Open Source AI Art
              </h2>
              <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/75 mt-3 md:mt-5 max-w-md">
                Free GPU hours for artists and developers to train on top of open AI art models.
                You get compute, share your results and what you learned for others to use.
              </p>
              <p className="text-[10px] md:text-[11px] text-white/30 mt-1.5 md:mt-2 max-w-md">
                LoRAs, finetunes, control vectors, dataset experiments, open model research.
              </p>
            </section>

            <section className="grid grid-cols-3 gap-px mt-5 md:mt-10">
              <div className="border border-[#39ff14]/10 bg-[#39ff14]/[0.03] p-2.5 md:p-5">
                <p className="text-[8px] md:text-[9px] font-bold tracking-[0.15em] uppercase text-[#39ff14]/40">Compute</p>
                <p className="text-xs md:text-lg font-bold mt-1 md:mt-1.5 text-white/80">10–50 GPU hrs</p>
                <p className="text-[9px] md:text-[10px] text-white/40 mt-0.5 md:mt-1">Choose your machine</p>
              </div>
              <div className="border border-[#a78bfa]/10 bg-[#a78bfa]/[0.03] p-2.5 md:p-5">
                <p className="text-[8px] md:text-[9px] font-bold tracking-[0.15em] uppercase text-[#a78bfa]/50">How it works</p>
                <p className="text-xs md:text-lg font-bold mt-1 md:mt-1.5 text-white/80">Auto approval</p>
                <p className="text-[9px] md:text-[10px] text-white/40 mt-0.5 md:mt-1">AI-decision in seconds</p>
              </div>
              <div className="border border-[#38bdf8]/10 bg-[#38bdf8]/[0.03] p-2.5 md:p-5">
                <p className="text-[8px] md:text-[9px] font-bold tracking-[0.15em] uppercase text-[#38bdf8]/50">Requirement</p>
                <p className="text-xs md:text-lg font-bold mt-1 md:mt-1.5 text-white/80">Open Source</p>
                <p className="text-[9px] md:text-[10px] text-white/40 mt-0.5 md:mt-1">Release models + learnings</p>
              </div>
            </section>

            <section className="mt-6 md:mt-12">
              <a
                href="https://discord.gg/kEqEbsAb8Q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-xs md:text-sm hover:bg-[#39ff14]/25 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.05)]"
              >
                Request Compute <ExternalLink size={14} />
              </a>
              <p className="text-[11px] md:text-xs text-white/55 mt-2 md:mt-3 max-w-sm leading-5">
                Request in Discord &rarr; AI reviews &rarr; response in minutes.
              </p>
            </section>
          </div>

          {/* Right: FAQ */}
          <div className="px-5 md:flex-1 md:px-10 py-5 md:py-16 md:max-w-md md:overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-5 md:mb-8 border-b border-white/10 pb-4">
              FAQ
            </h3>
            <FAQList>
              <FAQItem
                question="What can you do with 10–50 GPU hours?"
                answer={
                  <div className="space-y-3">
                    <p>
                      More than you'd think. Modern open models let you train control vectors,
                      LoRAs, and finetunes with very little compute.
                    </p>
                    <p>Two examples:</p>
                    <ul className="list-none space-y-2 pl-3 border-l border-white/10">
                      <li>
                        <span className="text-white/70">Train new control dimensions for LTX with IC-LoRAs</span>{" "}
                        — a whole new control dimension in as little as eight hours.
                      </li>
                      <li>
                        <span className="text-white/70">Train image-based control with edit LoRAs</span>{" "}
                        — like Flux2 and Qwen Edit. Add new modalities for tasks they can't do out of the box.
                      </li>
                    </ul>
                  </div>
                }
              />
              <FAQItem
                question="How much funding is available?"
                answer={
                  <div className="space-y-3 leading-relaxed">
                    <p>
                      Random degens created a memecoin based on one of my tweets. This resulted in me
                      getting creator fees and I donated 100% of them to open source to not profit off
                      their gambling.{" "}
                      <a href="https://pom.voyage/assorted/accountability#pisscoin-grants" target="_blank" rel="noopener noreferrer" className="underline text-white/50 hover:text-[#39ff14]/60">
                        Full details here.
                      </a>
                    </p>
                    <p>Started with ~{FALLBACK_BALANCE} SOL{usd && <> ({usd})</>}.</p>
                    <p>
                      Current balance:{" "}
                      <span className="text-white/70 font-bold">{sol.toLocaleString()} SOL</span>
                      {price && (
                        <span className="text-[#39ff14]/70 font-bold">
                          {" "}~ {(sol * price).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </span>
                      )}
                    </p>
                    {price && (
                      <p>
                        Roughly{" "}
                        <span className="text-white/70 font-bold">
                          {Math.floor((sol * price) / 45)} grants
                        </span>{" "}
                        in this batch.
                      </p>
                    )}
                    <div className="space-y-1 pt-2 text-[10px]">
                      <p className="uppercase tracking-widest font-bold text-white/30">Wallet</p>
                      <p>Address: <span className="break-all select-all text-white/40">{WALLET_ADDRESS}</span></p>
                      <p>
                        Explorer:{" "}
                        <a href={`https://solscan.io/account/${WALLET_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="underline text-white/40 hover:text-[#39ff14]/60">
                          solscan.io
                        </a>
                      </p>
                      <p>Network: Solana Mainnet</p>
                    </div>
                  </div>
                }
              />
              <FAQItem
                question="What kinds of models can I train?"
                answer="Any open source model. We prioritize projects that contribute back to the community through fine-tunes, architectural experiments, or novel datasets."
              />
              <FAQItem
                question="Do I need prior experience?"
                answer="Merit and reputation help — public contributions, previous work, and clearly articulated training goals — but it's okay if you're new, just start small."
              />
              <FAQItem
                question="What happens after I get the grant?"
                answer="Complete your project — whether successful or not — and share what you learned from the experience."
              />
              <FAQItem
                question="Can I use this for commercial projects?"
                answer="As long as the resulting model and learnings are released openly, yes. We want to accelerate the open source ecosystem."
              />
            </FAQList>
          </div>
        </div>

        <footer className="border-t border-white/8 px-5 md:px-10 py-3 md:py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.15em] text-white/30 backdrop-blur-[4px]">
          <span>&copy; 2026 ArtCompute</span>
          <span>
            A{" "}
            <a href="https://banodoco.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#39ff14]/40">
              Banodoco
            </a>{" "}
            project
          </span>
        </footer>
      </motion.main>
        )}
      </VideoShowcase>
    </div>
  );
}

interface ShowcaseControls {
  item: ShowcaseItem;
  progress: number;
  next: (fast?: boolean) => void;
  prev: (fast?: boolean) => void;
  openFullscreen: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BG_CLIP_DURATION = 15; // seconds per video in background mode

function VideoShowcase({ children }: { children: (controls: ShowcaseControls) => ReactNode }) {
  const [order] = useState(() => shuffle(SHOWCASE));
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bgVisible, setBgVisible] = useState(true);
  const [bgScale, setBgScale] = useState(1);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const advancedRef = useRef(false);
  const item = order[current];
  const nextItem = order[(current + 1) % order.length];

  const advance = useCallback((dir: 1 | -1, fast = false) => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setProgress(0);
    setBgVisible(false);
    setBgScale(fast ? 1 : 1.08);
    setTimeout(() => {
      setBgScale(0.97);
      setCurrent((c) => (c + dir + order.length) % order.length);
    }, fast ? 150 : 800);
  }, [order.length]);

  const next = useCallback((fast = false) => advance(1, fast), [advance]);
  const prev = useCallback((fast = false) => advance(-1, fast), [advance]);

  // When current changes, set up the new video and fade in
  useEffect(() => {
    advancedRef.current = false;
    startTimeRef.current = -1; // sentinel: RAF won't update progress until playback starts
    setProgress(0);
    const v = bgVideoRef.current;
    if (!v) return;
    const startPlayback = () => {
      const start = item.bgStart ?? 0;
      startTimeRef.current = start;
      v.currentTime = start;
      v.play().then(() => { setBgVisible(true); setBgScale(1); }).catch(() => { setBgVisible(true); setBgScale(1); });
    };
    // Reset src and wait for it to be ready
    v.src = item.src;
    v.load();
    const onCanPlay = () => {
      startPlayback();
      v.removeEventListener("canplay", onCanPlay);
    };
    v.addEventListener("canplay", onCanPlay);
    if (v.readyState >= 3) {
      startPlayback();
      v.removeEventListener("canplay", onCanPlay);
    }
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [current, item.src]);

  // Progress tracking + auto-advance at BG_CLIP_DURATION
  useEffect(() => {
    const tick = () => {
      const v = bgVideoRef.current;
      if (v && v.duration && !isNaN(v.duration) && !advancedRef.current && startTimeRef.current >= 0) {
        const elapsed = v.currentTime - startTimeRef.current;
        setProgress(Math.min(1, elapsed / BG_CLIP_DURATION));
        if (elapsed >= BG_CLIP_DURATION) {
          next();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [next]);

  const openFullscreen = () => {
    setFullscreen(true);
  };

  const handleCinemaClose = (newIndex: number) => {
    setCurrent(newIndex);
    setFullscreen(false);
  };

  return (
    <>
      {/* Background video — single element, CSS crossfade with scale + blur */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="w-full h-full transition-all duration-1000 ease-out"
          style={{
            opacity: bgVisible ? 0.4 : 0,
            transform: `scale(${bgScale})`,
            filter: bgVisible ? "blur(0px)" : "blur(8px)",
          }}
        >
          <video
            ref={bgVideoRef}
            muted
            playsInline
            poster={item.poster}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      </div>

      {/* Hidden preload of next video — browser caches it so transition is instant */}
      <video
        ref={preloadRef}
        key={nextItem.src}
        src={nextItem.src}
        preload="auto"
        muted
        playsInline
        className="hidden"
      />

      {children({ item, progress, next, prev, openFullscreen })}

      {/* Fullscreen cinema player */}
      <AnimatePresence>
        {fullscreen && <CinemaPlayer order={order} initialIndex={current} onClose={handleCinemaClose} />}
      </AnimatePresence>
    </>
  );
}

function ArtistBadge({ item, progress, next, prev, openFullscreen }: ShowcaseControls) {
  const [hovered, setHovered] = useState(false);

  const size = 34;
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="flex items-center gap-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artist name — animates when artist changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.artist}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mr-2 text-right"
        >
          <a
            href={item.socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-bold transition-colors ${hovered ? "text-white/60 hover:text-[#39ff14]/60" : "text-white/25"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {item.artist}
          </a>
          {item.tool && (
            <span className={`block text-[8px] transition-colors ${hovered ? "text-white/35" : "text-white/15"}`}>
              With {item.tool}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Avatar with progress ring */}
      <button
        onClick={openFullscreen}
        className="group relative flex items-center justify-center cursor-pointer"
      >
        {/* SVG progress ring */}
        <svg width={size} height={size} className="absolute -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(57,255,20,0.5)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-200"
          />
        </svg>
        {/* Inner circle — avatar animates on change */}
        <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-[10px] font-bold text-white/50 group-hover:text-[#39ff14]/80 transition-colors overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.avatar}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="group-hover:opacity-0 transition-opacity w-full h-full flex items-center justify-center relative"
            >
              {item.avatar.startsWith("/") ? (
                <>
                  <img src={item.avatar} alt={item.artist} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-colors ${hovered ? "bg-transparent" : "bg-black/50"}`} />
                </>
              ) : (
                item.avatar
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute -inset-1 rounded-full bg-black/50 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ boxShadow: "0 0 8px rgba(57,255,20,0.3)" }}>
            <Play size={12} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      </button>

      {/* Next arrow */}
      {SHOWCASE.length > 1 && (
        <button
          onClick={() => next(true)}
          className="p-0.5 hover:text-[#39ff14] text-white/20 hover:text-white/60 transition-all cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function CinemaPlayer({
  order,
  initialIndex,
  onClose,
}: {
  order: ShowcaseItem[];
  initialIndex: number;
  onClose: (currentIndex: number) => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const item = order[index];

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % order.length);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }, [order.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + order.length) % order.length);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }, [order.length]);


  // Sync video state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [volume, muted, index]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Auto-hide controls after 3s of no movement
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") { e.preventDefault(); togglePlay(); }
      else if (e.key === "Escape") onClose(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, togglePlay, onClose, index]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      style={{ cursor: controlsVisible ? "auto" : "none" }}
    >
      {/* Video with crossfade */}
      <AnimatePresence>
        <motion.video
          key={item.src}
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          className="absolute inset-0 w-full h-full object-contain"
          autoPlay
          playsInline
          onEnded={goNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Subtle top/bottom letterbox gradient */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-gradient-to-t from-black/70 to-transparent" />

      {/* Controls — fade in/out with mouse movement */}
      <motion.div
        animate={{ opacity: controlsVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Top left: artist badge */}
        <a
          href={item.socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-8 left-8 pointer-events-auto group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] hover:border-white/15 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-white/60 group-hover:text-white/90 transition-colors overflow-hidden">
            {item.avatar.startsWith("/") ? (
              <img src={item.avatar} alt={item.artist} className="w-full h-full object-cover rounded-full" />
            ) : (
              item.avatar
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm text-white/70 group-hover:text-white/90 transition-colors leading-tight">
              {item.artist}
            </span>
            <span className="text-[9px] text-white/30 group-hover:text-white/50 transition-colors">
              {item.tool ? `With ${item.tool}` : item.handle}
            </span>
          </div>
          <ExternalLink size={11} className="text-white/20 group-hover:text-white/50 transition-colors ml-1" />
        </a>

        {/* Top right: close */}
        <button
          onClick={() => onClose(index)}
          className="absolute top-8 right-8 pointer-events-auto p-3 text-white/30 hover:text-white/80 transition-colors duration-300"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Bottom bar */}
        <div className="absolute bottom-0 inset-x-0 px-10 pb-8 pt-16 pointer-events-auto space-y-5">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="group w-full h-1 bg-white/10 cursor-pointer relative"
            onClick={seek}
          >
            <div
              className="h-full bg-white/40 group-hover:bg-white/60 transition-colors relative"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex justify-between items-center">
            {/* Left: play + volume + time */}
            <div className="flex items-center gap-5">
              <button onClick={togglePlay} className="text-white/50 hover:text-white/90 transition-colors">
                {playing ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </button>

              <div
                className="flex items-center gap-2 relative"
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
              >
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  {muted || volume === 0 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                  )}
                </button>
                {showVolume && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muted ? 0 : volume}
                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                    className="w-16 h-0.5 appearance-none bg-white/20 rounded-full cursor-pointer accent-white/60 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70"
                  />
                )}
              </div>

              <span className="text-[10px] text-white/25 font-mono tabular-nums">
                {fmt(currentTime)} / {fmt(duration)}
              </span>
            </div>

            {/* Right: navigation */}
            {order.length > 1 && (
              <div className="flex items-center gap-5">
                <button
                  onClick={goPrev}
                  className="text-white/25 hover:text-white/70 transition-colors duration-300"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <span className="text-[9px] tracking-[0.2em] uppercase text-white/25 tabular-nums">
                  {index + 1} / {order.length}
                </span>
                <button
                  onClick={goNext}
                  className="text-white/25 hover:text-white/70 transition-colors duration-300"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FAQList({ children }: { children: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = Array.isArray(children) ? children : [children];

  return (
    <div>
      {items.map((child: any, i: number) => ({
        ...child,
        props: {
          ...child.props,
          isOpen: openIndex === i,
          onToggle: () => setOpenIndex(openIndex === i ? null : i),
        },
      }))}
    </div>
  );
}

function FAQItem({
  question,
  answer,
  isOpen = false,
  onToggle,
}: {
  question: string;
  answer: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="group border-b border-white/8">
      <div className="flex justify-between items-start gap-4 cursor-pointer py-4" onClick={onToggle}>
        <h4 className={`text-xs leading-relaxed transition-colors group-hover:text-[#39ff14]/60 ${isOpen ? "text-white/85" : "text-white/55"}`}>
          {question}
        </h4>
        <ChevronDown
          size={14}
          className={`shrink-0 mt-0.5 ${isOpen ? "rotate-180" : ""} text-white/30`}
        />
      </div>
      {isOpen && (
        <div className="pb-4 text-xs leading-relaxed text-white/45">
          {answer}
        </div>
      )}
    </div>
  );
}

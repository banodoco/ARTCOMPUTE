import { motion } from "motion/react";
import { ChevronDown, ExternalLink, ArrowRight } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import { VideoShowcase, ArtistBadge, SHOWCASE } from "./VideoShowcase";

const WALLET_ADDRESS = "FBXSuVueW9Z1U2RmgmYazAX1GGdzay75AKHD9ijJpszq";
const FALLBACK_BALANCE = 34.0001;

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
              <div className="flex items-center gap-3">
                <a
                  href="https://discord.gg/kEqEbsAb8Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-xs md:text-sm hover:bg-[#39ff14]/25 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.05)]"
                >
                  Request Compute <ExternalLink size={14} />
                </a>
                <Link
                  to="/grants"
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border border-white/10 text-white/50 text-xs md:text-sm hover:border-white/20 hover:text-white/70 transition-colors"
                >
                  View Grants <ArrowRight size={14} />
                </Link>
              </div>
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const WALLET_ADDRESS = "FBXSuVueW9Z1U2RmgmYazAX1GGdzay75AKHD9ijJpszq";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const FALLBACK_BALANCE = 34.0001;

export default function App() {
  const [balance, setBalance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const connection = new Connection(SOLANA_RPC, 'confirmed');
      const publicKey = new PublicKey(WALLET_ADDRESS);
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);

      const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        setPrice(priceData.solana.usd);
      }
    } catch (error) {
      console.error("Error fetching funds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
    const interval = setInterval(fetchFunds, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen scanlines grain relative overflow-hidden flex flex-col">
      {/* Video background */}
      <div className="fixed inset-0 pointer-events-none select-none" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
          src="/ssstwitter.com_1772746835419.mp4"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 h-full flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <header className="border-b border-white/8 px-6 md:px-10 py-4 flex justify-between items-center">
          <h1 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
            Art Compute
          </h1>
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/30">
            Micro Grants Program
          </span>
        </header>

        {/* Main content: side by side */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 md:overflow-hidden overflow-auto">
          {/* Left: Hero + Info */}
          <div className="flex-1 px-6 md:px-12 py-10 md:py-0 md:flex md:flex-col md:justify-center md:border-r border-white/8">
            <section>
              <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight text-white/95 tracking-tight">
                Micro Grants for<br />Open Source AI Art
              </h2>
              <p className="text-sm leading-7 text-white/75 mt-5 max-w-md">
                Free GPU hours for artists and developers to train on top of open AI art models. You get compute, share your results and what you learned for others to use.
              </p>
              <p className="text-[11px] text-white/30 mt-2 max-w-md">
                LoRAs, finetunes, control vectors, dataset experiments, open model research.
              </p>
            </section>

            {/* Key facts */}
            <section className="grid grid-cols-3 gap-px mt-10">
              <div className="border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/50">Compute</p>
                <p className="text-lg font-bold mt-1.5 text-white/95">10–50 GPU hrs</p>
                <p className="text-[10px] text-white/40 mt-1">Choose your machine</p>
              </div>
              <div className="border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/50">How it works</p>
                <p className="text-lg font-bold mt-1.5 text-white/95">Automated approval</p>
                <p className="text-[10px] text-white/40 mt-1">AI-decision in seconds</p>
              </div>
              <div className="border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/50">Requirement</p>
                <p className="text-lg font-bold mt-1.5 text-white/95">Open Source</p>
                <p className="text-[10px] text-white/40 mt-1">Release models + learnings</p>
              </div>
            </section>

            {/* CTA */}
            <section className="mt-12">
              <a
                href="https://discord.gg/banadoco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-sm hover:bg-[#39ff14]/25 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.05)]"
              >
                Request Compute <ExternalLink size={14} />
              </a>
              <p className="text-xs text-white/55 mt-3 max-w-sm leading-5">
                Request in Discord &rarr; AI reviews &rarr; response in minutes.
              </p>
            </section>
          </div>

          {/* Right: FAQ */}
          <div className="flex-1 px-6 md:px-10 py-10 md:py-16 md:max-w-md overflow-y-auto">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-6">
              FAQ
            </h3>

            <FAQList>
              <FAQItem
                question="What can you do with 10–50 GPU hours?"
                answer={
                  <div className="space-y-3">
                    <p>
                      More than you'd think. Modern open models let you train control vectors, LoRAs, and finetunes with very little compute.
                    </p>
                    <p>Two examples:</p>
                    <ul className="list-none space-y-2 pl-3 border-l border-white/10">
                      <li>
                        <span className="text-white/70">Train new control dimensions for LTX with IC-LoRAs</span> — a whole new control dimension in as little as eight hours.
                      </li>
                      <li>
                        <span className="text-white/70">Train image-based control with edit LoRAs</span> — like Flux2 and Qwen Edit. Add new modalities for tasks they can't do out of the box.
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
                      Random degens created a memecoin based on one of my tweets. This resulted in me getting creator fees and I donated 100% of them to open source to not profit off their gambling. <a href="https://pom.voyage/assorted/accountability#pisscoin-grants" target="_blank" rel="noopener noreferrer" className="underline text-white/50 hover:text-[#39ff14]/60">Full details here.</a>
                    </p>
                    <p>
                      Started with ~{FALLBACK_BALANCE} SOL{price && <> ({((FALLBACK_BALANCE) * price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})</>}.
                    </p>
                    <p>
                      Current balance: <span className="text-white/70 font-bold">{balance !== null ? balance.toLocaleString() : FALLBACK_BALANCE.toLocaleString()} SOL</span>
                      {price && (
                        <span className="text-[#39ff14]/70 font-bold">
                          {' '}~ {((balance || FALLBACK_BALANCE) * price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      )}
                    </p>
                    {price && (
                      <p>
                        Roughly <span className="text-white/70 font-bold">
                          {Math.floor(((balance || FALLBACK_BALANCE) * price) / 45)} grants
                        </span> in this batch.
                      </p>
                    )}
                    <div className="space-y-1 pt-2 text-[10px]">
                      <p className="uppercase tracking-widest font-bold text-white/30">Wallet</p>
                      <p>Address: <span className="break-all select-all text-white/40">{WALLET_ADDRESS}</span></p>
                      <p>Explorer: <a href={`https://solscan.io/account/${WALLET_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="underline text-white/40 hover:text-[#39ff14]/60">solscan.io</a></p>
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
                answer="Merit and reputation matter — public contributions, previous work, and clearly articulated training goals. If you're new, start small."
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

        {/* Footer */}
        <footer className="border-t border-white/8 px-6 md:px-10 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.15em] text-white/30">
          <span>&copy; 2026 Art Compute</span>
          <span>A <a href="https://banodoco.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#39ff14]/40">Banodoco</a> project</span>
        </footer>
      </motion.main>
    </div>
  );
}

function FAQList({ children }: { children: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className="space-y-0">
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

function FAQItem({ question, answer, isOpen = false, onToggle }: { question: string; answer: ReactNode; isOpen?: boolean; onToggle?: () => void }) {
  return (
    <div className="group border-b border-white/8">
      <div
        className="flex justify-between items-start gap-4 cursor-pointer py-4"
        onClick={onToggle}
      >
        <h4 className="text-xs text-white/55 group-hover:text-[#39ff14]/60 transition-colors leading-relaxed">
          {question}
        </h4>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180' : ''} text-white/30`}
        />
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pb-4 text-xs leading-relaxed text-white/45"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}

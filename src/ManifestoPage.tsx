import { motion } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { VideoShowcase, ArtistBadge, SHOWCASE } from "./VideoShowcase";

const SUPABASE_STORAGE = "https://ujlwuvkrxlvoswwkerdf.supabase.co/storage/v1/object/public/videos/artcompute";

interface Example {
  title: string;
  hours: string;
  description: string[];
  media: { type: "video" | "image"; src: string; caption: string };
  huggingface: { label: string; url: string };
}

const EXAMPLES: Example[] = [
  {
    title: "Doctor Diffusion — IC-LoRA Colorizer for LTX 2.3",
    hours: "~6 hours",
    description: [
      "Doctor Diffusion trained a custom IC-LoRA that can add color to black and white footage — and it took about 6 hours. He used 162 clips (111 synthetic, 51 real footage), desaturated them all, and trained at 512\u00d7512 / 121 frames / 24fps for 5000 steps on the official Lightricks training script.",
      "His first attempt was only 3.5 hours with 64 clips and it already showed results. 6 hours of GPU time for a genuinely useful new capability on top of an open source video model.",
    ],
    media: {
      type: "video",
      src: `${SUPABASE_STORAGE}/dr_diffusion_colorizer.webm`,
      caption: "Colorizing black and white footage with the IC-LoRA",
    },
    huggingface: {
      label: "LTX-2.3-IC-LoRA-Colorizer",
      url: "https://huggingface.co/DoctorDiffusion/LTX-2.3-IC-LoRA-Colorizer",
    },
  },
  {
    title: "Fill (MachineDelusions) — Image-to-Video Adapter for LTX-Video 2",
    hours: "< 1 week on a single GPU",
    description: [
      "Out of the box, getting LTX-2 to reliably do image-to-video requires heavy workflow engineering — ControlNet stacking, image preprocessing, latent manipulation, careful node routing. Fill trained a high-rank LoRA adapter on 30,000 generated videos that eliminates all of that complexity. Just feed it an image and it produces solid video — no elaborate pipelines needed.",
      "He trained this in less than a week on a single GPU and released it fully open source.",
    ],
    media: {
      type: "video",
      src: `${SUPABASE_STORAGE}/fill_i2v_examples.mp4`,
      caption: "Fill's demos plus community tests with/without the adapter (LTX 2.0 \u2014 LTX 2.3 is a lot better for i2v out-the-box)",
    },
    huggingface: {
      label: "LTX-2 Image2Video Adapter",
      url: "https://huggingface.co/MachineDelusions/LTX-2_Image2Video_Adapter_LoRa",
    },
  },
  {
    title: "InStyle — Style Transfer LoRA for Qwen Edit",
    hours: "~40 hours",
    description: [
      "A LoRA for QwenEdit that significantly improves its ability to generate images based on a style reference. The base model can do this but often misses the nuances of styles and transplants details from the input image. Trained on 10k Midjourney style-reference images in under 40 hours of compute, InStyle gets the model to actually capture and transfer visual styles accurately.",
    ],
    media: {
      type: "image",
      src: `${SUPABASE_STORAGE}/instyle_samples.png`,
      caption: "Style transfer samples",
    },
    huggingface: {
      label: "Qwen-Image-Edit-InStyle",
      url: "https://huggingface.co/peteromallet/Qwen-Image-Edit-InStyle",
    },
  },
  {
    title: "Alisson Pereira — BFS Head Swap IC-LoRA for LTX-2",
    hours: "~60 hours",
    description: [
      "Alisson spent 3 weeks and over 60 hours of training to build an IC-LoRA that can swap faces in video \u2014 you give it a face in the first frame and it propagates that identity throughout the clip. Trained on 300+ high-quality head swap pairs at 512\u00d7512 to speed up R&D.",
    ],
    media: {
      type: "video",
      src: `${SUPABASE_STORAGE}/alisson_headswap_examples.mp4`,
      caption: "Head swap comparisons",
    },
    huggingface: {
      label: "BFS-Best-Face-Swap-Video",
      url: "https://huggingface.co/Alissonerdx/BFS-Best-Face-Swap-Video",
    },
  },
];

function AutoPlayVideo({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      loop
      aria-label={caption}
      className="w-full border border-white/8 bg-black"
    />
  );
}

export default function ManifestoPage() {
  return (
    <div className="min-h-screen scanlines grain relative flex flex-col">
      {SHOWCASE.map((s) =>
        s.avatar.startsWith("/") ? (
          <link key={s.avatar} rel="preload" as="image" href={s.avatar} />
        ) : null
      )}
      <VideoShowcase>
        {(showcaseControls) => (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="border-b border-white/8 px-5 md:px-10 py-3 md:py-4 flex justify-between items-center">
              <Link
                to="/"
                className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 hover:text-[#39ff14]/60 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={12} />
                ArtCompute
              </Link>
              <ArtistBadge {...showcaseControls} />
            </header>

            {/* Content */}
            <div className="flex-1 w-full py-8 md:py-16">
              {/* Title — narrower */}
              <section className="max-w-3xl mx-auto px-5 md:px-10 mb-8 md:mb-12">
                <h2 className="font-serif text-2xl md:text-4xl font-normal leading-tight text-white/95 tracking-tight">
                  We Want to Help You Do
                  <br />
                  a Lot With Very Little Compute
                </h2>
                <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/55 mt-4 md:mt-6 max-w-lg">
                  A lot of people say they'd like to train LoRAs or fine-tunes
                  but compute is the blocker. But we think people underestimate
                  how much you can actually get done with very little compute,
                  thanks to paradigms like IC-LoRAs for LTX2 and various Edit
                  Models.
                </p>
                <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/55 mt-3 max-w-lg">
                  <a
                    href="https://banodoco.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#39ff14]/60 transition-colors underline"
                  >
                    Banodoco
                  </a>{" "}
                  is launching{" "}
                  <span className="text-white/80 font-bold">
                    ArtCompute Microgrants
                  </span>{" "}
                  — 5-50 GPU hours for open source AI art projects. You describe
                  what you want to do, an AI reviews your application, and if
                  approved you get given a grant within minutes.
                </p>
              </section>

              {/* Examples subheader — narrower */}
              <div className="max-w-3xl mx-auto px-5 md:px-10 mb-6 md:mb-10">
                <h3 className="font-serif text-lg md:text-2xl font-normal leading-tight text-white/90 tracking-tight">
                  Some Examples of What You Can Do With Very Little Compute
                </h3>
                <p className="text-[11px] md:text-xs leading-relaxed text-white/40 mt-2">
                  Note: these are examples of what you can do with very little compute but they were not trained with our compute grants. You can see the current grants{" "}
                  <Link to="/grants" className="underline text-white/50 hover:text-[#39ff14]/60 transition-colors">
                    here
                  </Link>.
                </p>
              </div>

              {/* Examples — wider, side-by-side layout */}
              <div className="max-w-5xl mx-auto px-5 md:px-10 space-y-10 md:space-y-16">
                {EXAMPLES.map((ex, i) => (
                  <motion.section
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="border border-white/8 bg-white/[0.02]"
                  >
                    <div className="md:flex">
                      {/* Text side */}
                      <div className="px-5 md:px-8 pt-5 md:pt-8 pb-5 md:pb-8 md:w-2/5 md:flex md:flex-col">
                        <div className="flex items-start justify-between gap-3 md:flex-col md:gap-2">
                          <h3 className="text-sm md:text-base font-bold text-white/85 leading-snug">
                            {ex.title}
                          </h3>
                          <span className="flex-shrink-0 text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 border border-[#39ff14]/20 bg-[#39ff14]/[0.05] text-[#39ff14]/60 self-start">
                            {ex.hours}
                          </span>
                        </div>

                        <div className="mt-4 space-y-3 flex-1">
                          {ex.description.map((para, j) => (
                            <p
                              key={j}
                              className="text-[11px] md:text-xs leading-relaxed text-white/45"
                            >
                              {para}
                            </p>
                          ))}
                        </div>

                        <a
                          href={ex.huggingface.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-[10px] md:text-[11px] text-white/40 hover:text-[#39ff14]/60 transition-colors underline"
                        >
                          {ex.huggingface.label} on HuggingFace
                          <ExternalLink size={10} />
                        </a>
                      </div>

                      {/* Media side */}
                      <div className="md:w-3/5 md:border-l border-t md:border-t-0 border-white/5 flex flex-col">
                        <p className="px-5 md:px-6 pt-3 text-[9px] font-bold tracking-[0.2em] uppercase text-white/20">
                          {ex.media.caption}
                        </p>
                        <div className="p-3 md:p-4 flex-1 flex items-center">
                          {ex.media.type === "video" ? (
                            <AutoPlayVideo src={ex.media.src} caption={ex.media.caption} />
                          ) : (
                            <img
                              src={ex.media.src}
                              alt={ex.media.caption}
                              className="w-full border border-white/8 bg-white/[0.02]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Bottom CTA — narrower */}
              <section className="max-w-3xl mx-auto px-5 md:px-10 mt-12 md:mt-20">
                <div className="border border-white/8 bg-white/[0.02] p-6 md:p-10">
                  <h3 className="font-serif text-lg md:text-2xl font-normal leading-tight text-white/90 tracking-tight mb-4 md:mb-6">
                    Get an Instant Response for GPU Hours
                  </h3>
                  <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/55">
                    These are all examples of people extending the capabilities of
                    open source models with a tiny amount of compute — but there's
                    so much more you could do.
                  </p>
                  <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/55 mt-3">
                    If you've got an idea for training something on top of an open
                    source model, apply below.
                  </p>
                  <p className="text-xs md:text-sm leading-6 md:leading-7 text-white/55 mt-3">
                    Our only ask in return is that{" "}
                    <span className="text-white/80 font-bold">
                      you must open source your results and share information on
                      the training process and what you learned
                    </span>
                    . We'll publish absolutely everything — including who gets the
                    grants and what they do with them.
                  </p>

                  <div className="flex items-center gap-3 mt-6 md:mt-8">
                    <a
                      href="https://discord.gg/kEqEbsAb8Q"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] text-xs md:text-sm hover:bg-[#39ff14]/25 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.05)]"
                    >
                      Apply in Discord <ExternalLink size={14} />
                    </a>
                    <Link
                      to="/grants"
                      className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 border border-white/10 text-white/50 text-xs md:text-sm hover:border-white/20 hover:text-white/70 transition-colors"
                    >
                      View Current Grants
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/8 px-5 md:px-10 py-3 md:py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.15em] text-white/30">
              <span>&copy; 2026 ArtCompute</span>
              <span>
                A{" "}
                <a
                  href="https://banodoco.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#39ff14]/40"
                >
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

import { useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";

const VISIBLE = 4;

function ServiceSkeleton() {
  return (
    <div className="flex-1 flex flex-col border border-[var(--color-zen-accent)]/20 overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-[var(--color-zen-accent)]/10" />
      <div className="flex flex-col p-4 gap-3 bg-white">
        <div className="h-5 w-3/4 bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="h-3 w-full bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="h-3 w-2/3 bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-zen-accent)]/20">
          <div className="h-4 w-1/4 bg-[var(--color-zen-accent)]/20 rounded" />
          <div className="h-8 w-20 bg-[var(--color-zen-accent)]/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({ services = [] }) {
  const [startIndex, setStartIndex] = useState(0);
  const isLoading = services.length === 0;

  const visibleServices = services.slice(startIndex, startIndex + VISIBLE);
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + VISIBLE < services.length;

  const goLeft = () => setStartIndex((i) => Math.max(0, i - VISIBLE));
  const goRight = () =>
    setStartIndex((i) => Math.min(services.length - VISIBLE, i + VISIBLE));

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <h2 className="font-[var(--font-logo)] text-4xl font-semibold text-[var(--color-zen-primary)] tracking-wide mb-3">
          Our Services
        </h2>
        <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
      </div>

      {/* ── Slider ── */}
      <div className="relative px-12">
        {/* Arrow Left */}
        <button
          onClick={goLeft}
          disabled={!canGoLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] transition-all duration-200 shadow-md ${!canGoLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-zen-accent-hover)]"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Cards */}
        <div className="flex gap-4">
          {isLoading
            ? [...Array(VISIBLE)].map((_, i) => <ServiceSkeleton key={i} />)
            : visibleServices.map((item) => (
                <div key={item.id} className="flex-1">
                  <ServiceCard item={item} moreInfoLink="/services" />
                </div>
              ))}
        </div>

        {/* Arrow Right */}
        <button
          onClick={goRight}
          disabled={!canGoRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] transition-all duration-200 shadow-md ${!canGoRight ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-zen-accent-hover)]"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* ── Dots ── */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(services.length / VISIBLE) }).map(
          (_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i * VISIBLE)}
              className={`h-2 transition-all duration-200 ${startIndex / VISIBLE === i ? "bg-[var(--color-zen-accent)] w-4" : "bg-[var(--color-zen-accent)]/30 w-2"}`}
            />
          ),
        )}
      </div>
    </section>
  );
}

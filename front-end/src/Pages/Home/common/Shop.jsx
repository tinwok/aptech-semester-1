import { useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";

const VISIBLE = 5;

export default function Shop({ products = [] }) {
  const [startIndex, setStartIndex] = useState(0);

  const visibleProducts = products.slice(startIndex, startIndex + VISIBLE);
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + VISIBLE < products.length;

  const goLeft = () => setStartIndex((i) => Math.max(0, i - VISIBLE));
  const goRight = () =>
    setStartIndex((i) => Math.min(products.length - VISIBLE, i + VISIBLE));

  return (
    <section className="py-16 bg-[var(--color-zen-accent)]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h2 className="font-[var(--font-logo)] text-4xl font-semibold text-[var(--color-zen-primary)] tracking-wide mb-3">
            Products
          </h2>
          <div className="w-16 h-0.5 mx-auto bg-[var(--color-zen-accent)]" />
        </div>

        {/* ── Product count ── */}
        <div className="flex justify-end mb-6">
          <span className="font-[var(--font-sans)] text-sm text-[var(--color-zen-primary)]/60">
            {products.length} products
          </span>
        </div>

        {/* ── Slider ── */}
        <div className="relative px-12">
          {/* Arrow Left */}
          <button
            onClick={goLeft}
            disabled={!canGoLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] transition-all duration-200 shadow-md ${!canGoLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-zen-accent-hover)]"}`}
            aria-label="Previous"
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
          {products.length === 0 ? (
            <div className="flex gap-2">
              {[...Array(VISIBLE)].map((_, i) => (
                <div
                  key={i}
                  className="w-44 h-64 bg-[var(--color-zen-accent)]/20 animate-pulse shrink-0 flex-1"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {visibleProducts.map((item) => (
                <div key={item.id} className="flex-1">
                  <ServiceCard
                    item={item}
                    size="small"
                    moreInfoLink="/products"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Arrow Right */}
          <button
            onClick={goRight}
            disabled={!canGoRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] transition-all duration-200 shadow-md ${!canGoRight ? "opacity-30 cursor-not-allowed" : "hover:bg-[var(--color-zen-accent-hover)]"}`}
            aria-label="Next"
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

        {/* ── Dot indicator ── */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(products.length / VISIBLE) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * VISIBLE)}
                className={`w-2 h-2 transition-all duration-200 ${startIndex / VISIBLE === i ? "bg-[var(--color-zen-accent)] w-4" : "bg-[var(--color-zen-accent)]/30"}`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

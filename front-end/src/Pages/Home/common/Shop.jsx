import { useState, useEffect, useRef } from "react";
import ServiceCard from "@/components/ui/ServiceCard";

const TABS = [
  { key: "hair", label: "Hair Styling", link: "/service/hair-styling" },
  { key: "skin", label: "Skin Care", link: "/service/skin-care" },
];

export default function Shop({ hairProducts = [], skinProducts = [] }) {
  const [activeTab, setActiveTab] = useState("hair");
  const sliderRef = useRef(null);

  // reset scroll khi đổi tab
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const items = activeTab === "hair" ? hairProducts : skinProducts;

  const sliderLeft = () => {
    sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  const sliderRight = () => {
    sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-[var(--color-zen-accent)]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section header ── */}
        <div className="text-center mb-8">
          <h2
            className="font-[var(--font-logo)] text-4xl font-semibold
            text-[var(--color-zen-primary)] tracking-wide mb-3"
          >
            Product
          </h2>
          <div className="w-16 h-0.5 mx-auto bg-[var(--color-zen-accent)]"></div>
        </div>

        {/* ── Tabs + product count ── */}
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 h-10 font-[var(--font-logo)] text-sm tracking-wide border border-[var(--color-zen-accent)] transition-all duration-200 ${activeTab === tab.key ? "bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)]" : "bg-transparent text-[var(--color-zen-primary)] hover:bg-[var(--color-zen-accent)]/30"} `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product count */}
          <span
            className="
            font-[var(--font-sans)] text-sm
            text-[var(--color-zen-primary)]/60
          "
          >
            {items.length} product
          </span>
        </div>

        {/* ── Slider ── */}
        <div className="relative px-6">
          {/* Arrow Left */}
          <button
            onClick={sliderLeft}
            className="
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center
              bg-[var(--color-zen-accent)]
              text-[var(--color-zen-primary)]
              hover:bg-[var(--color-zen-accent-hover)]
              transition-all duration-200 shadow-md
            "
            aria-label="To the left"
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
          {items.length === 0 ? (
            <div className="flex gap-2 px-12">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-44 h-64 bg-[var(--color-zen-accent)]/20 animate-pulse shrink-0"
                />
              ))}
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="
                flex gap-2 overflow-x-auto
                scroll-smooth scrollbar-hide
                px-1 py-2
              "
            >
              {items.map((item) => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  size="small"
                  moreInfoLink={activeTabData.link}
                />
              ))}
            </div>
          )}

          {/* Arrow Right */}
          <button
            onClick={sliderRight}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center
              bg-[var(--color-zen-accent)]
              text-[var(--color-zen-primary)]
              hover:bg-[var(--color-zen-accent-hover)]
              transition-all duration-200 shadow-md
            "
            aria-label="To the right"
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
      </div>
    </section>
  );
}

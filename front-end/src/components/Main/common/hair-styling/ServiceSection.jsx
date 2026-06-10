import ServiceCard from "@/components/ui/ServiceCard";

function ServiceSkeleton() {
  return (
    <div className="flex flex-col border border-[var(--color-zen-accent)]/20 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-52 bg-[var(--color-zen-accent)]/10" />
      {/* Text skeleton */}
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

export default function ServiceSection({ services = [] }) {
  const isLoading = services.length === 0;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <h2
          className="font-[var(--font-logo)] text-4xl font-semibold
          text-[var(--color-zen-primary)] tracking-wide mb-3"
        >
          Our Service
        </h2>
        <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {isLoading
          ? [...Array(8)].map((_, i) => <ServiceSkeleton key={i} />)
          : services.map((item) => (
              <ServiceCard key={item.id} item={item} moreInfoLink="/services" />
            ))}
      </div>
    </section>
  );
}

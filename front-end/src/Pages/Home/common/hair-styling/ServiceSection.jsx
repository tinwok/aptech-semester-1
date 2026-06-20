import ServiceCard from "@/components/ui/ServiceCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ServiceSkeleton() {
  return (
    <div className="flex flex-col border border-[var(--color-zen-accent)]/20 overflow-hidden animate-pulse h-full">
      <div className="w-full h-52 bg-[var(--color-zen-accent)]/10" />
      <div className="flex flex-col p-4 gap-3 bg-white flex-1">
        <div className="h-5 w-3/4 bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="h-3 w-full bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="h-3 w-2/3 bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-zen-accent)]/20 mt-auto">
          <div className="h-4 w-1/4 bg-[var(--color-zen-accent)]/20 rounded" />
          <div className="h-8 w-20 bg-[var(--color-zen-accent)]/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({ services = [] }) {
  const isLoading = services.length === 0;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center mb-10">
        <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase text-[var(--color-zen-accent)] mb-3">
          What We Offer
        </p>
        <h2 className="font-[var(--font-logo)] text-5xl font-semibold text-[var(--color-zen-primary)] tracking-wide mb-4">
          Our Services
        </h2>
        <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
      </div>

      {/* ── Carousel ── */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-6">
            {services.map((item) => (
              <CarouselItem
                key={item.id}
                className="flex pl-4 basis-full sm:basis-1/2 lg:basis-1/4 overflow-visible transition-[z-index] hover:z-20"
              >
                <ServiceCard item={item} moreInfoLink="/services" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows */}
          <CarouselPrevious className="left-0 rounded-none bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] border-none hover:bg-[var(--color-zen-accent-hover)] hover:text-[var(--color-zen-primary)]" />
          <CarouselNext className="right-0 rounded-none bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] border-none hover:bg-[var(--color-zen-accent-hover)] hover:text-[var(--color-zen-primary)]" />
        </Carousel>
      )}
    </section>
  );
}

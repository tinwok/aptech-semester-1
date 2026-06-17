const VALUES = [
  {
    icon: "✦",
    title: "Excellence",
    description:
      "We pursue the highest standards in every service, ensuring each client leaves feeling their absolute best.",
  },
  {
    icon: "♡",
    title: "Dedication",
    description:
      "Our team is fully committed to understanding and fulfilling each client's unique needs and preferences.",
  },
  {
    icon: "✿",
    title: "Innovation",
    description:
      "We continuously update our techniques and products to bring you the latest trends in beauty and wellness.",
  },
  {
    icon: "◈",
    title: "Trust",
    description:
      "Built on transparency and integrity, we foster long-lasting relationships with every client we serve.",
  },
];

const WHY_CHOOSE = [
  {
    title: "Professional Stylists",
    description:
      "Our team consists of highly trained professionals with years of experience in the beauty industry.",
  },
  {
    title: "Premium Products",
    description:
      "We use only the finest products to ensure outstanding results for your hair and skin.",
  },
  {
    title: "Relaxing Atmosphere",
    description:
      "Our salon is designed to provide a peaceful and luxurious experience from the moment you arrive.",
  },
  {
    title: "Personalized Service",
    description:
      "Every client receives a customized treatment plan tailored to their specific needs and goals.",
  },
];

export default function AboutPage() {
  return (
    <div className="text-[var(--color-zen-primary)]">
      {/* ── Hero Banner ── */}
      <div className="relative h-72 bg-[var(--color-zen-primary)] flex items-center justify-center overflow-hidden">
        <img
          src="/images/about/hero.png"
          alt="About ZenStyle"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative text-center text-white">
          <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase mb-3 text-[var(--color-zen-accent)]">
            Who We Are
          </p>
          <h1 className="font-[var(--font-logo)] text-6xl font-semibold">
            About Us
          </h1>
        </div>
      </div>

      {/* ── Our Story ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative z-0">
            <div className="relative z-10 aspect-[43/24] overflow-hidden">
              <img
                src="/images/about/our-story.png"
                alt="Our Story"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Gold accent border */}
            <div className="absolute -bottom-4 -right-4 z-0 w-full h-full border-2 border-[var(--color-zen-accent)]" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase text-[var(--color-zen-accent)] mb-3">
                Our Story
              </p>
              <h2 className="font-[var(--font-logo)] text-5xl font-semibold leading-tight mb-6">
                A Journey of Beauty & Excellence
              </h2>
              <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mb-8" />
            </div>
            <p className="font-[var(--font-sans)] text-base leading-relaxed text-[var(--color-zen-primary)]/70">
              Founded with a passion for beauty and wellness, ZenStyle has grown
              from a small neighborhood salon into a premium destination for
              those who seek quality and relaxation. Our journey began with a
              simple belief — everyone deserves to look and feel their best.
            </p>
            <p className="font-[var(--font-sans)] text-base leading-relaxed text-[var(--color-zen-primary)]/70">
              Over the years, we have built a team of dedicated professionals
              who share our vision of excellence. From classic cuts to advanced
              skin treatments, every service we offer is crafted with precision,
              care, and a deep respect for our clients.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--color-zen-accent)]/20">
              {[
                { number: "5+", label: "Years of Experience" },
                { number: "50+", label: "Expert Stylists" },
                { number: "10K+", label: "Happy Clients" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-[var(--font-logo)] text-4xl font-semibold text-[var(--color-zen-accent)]">
                    {stat.number}
                  </p>
                  <p className="font-[var(--font-sans)] text-xs text-[var(--color-zen-primary)]/60 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-20 bg-[var(--color-zen-accent)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase text-[var(--color-zen-accent)] mb-3">
              What We Stand For
            </p>
            <h2 className="font-[var(--font-logo)] text-5xl font-semibold mb-4">
              Our Values
            </h2>
            <div className="w-16 h-0.5 bg-[var(--color-zen-accent)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white p-8 flex flex-col gap-4 border border-[var(--color-zen-accent)]/20 hover:border-[var(--color-zen-accent)] hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-3xl text-[var(--color-zen-accent)] group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </span>
                <h3 className="font-[var(--font-logo)] text-2xl font-semibold">
                  {value.title}
                </h3>
                <p className="font-[var(--font-sans)] text-sm leading-relaxed text-[var(--color-zen-primary)]/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase text-[var(--color-zen-accent)] mb-3">
                Our Difference
              </p>
              <h2 className="font-[var(--font-logo)] text-5xl font-semibold mb-4">
                Why Choose ZenStyle?
              </h2>
              <div className="w-16 h-0.5 bg-[var(--color-zen-accent)]" />
            </div>

            <div className="flex flex-col gap-6">
              {WHY_CHOOSE.map((item, index) => (
                <div key={item.title} className="flex gap-5 items-start group">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--color-zen-accent)] text-[var(--color-zen-accent)] font-[var(--font-logo)] text-lg group-hover:bg-[var(--color-zen-accent)] group-hover:text-white transition-all duration-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="font-[var(--font-logo)] text-xl font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="font-[var(--font-sans)] text-sm leading-relaxed text-[var(--color-zen-primary)]/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative z-0">
            <div className="relative z-10 aspect-[33/14] overflow-hidden">
              <img
                src="/images/about/why-choose-us.png"
                alt="Why Choose ZenStyle"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-4 z-0 w-full h-full border-2 border-[var(--color-zen-accent)]" />
          </div>
        </div>
      </section>
    </div>
  );
}

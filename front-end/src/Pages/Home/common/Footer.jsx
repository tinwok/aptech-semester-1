import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "About Us", path: "/about-us" },
  { label: "Services", path: "/services" },
  { label: "Staff", path: "/staff" },
  { label: "Booking", path: "/booking" },
];

const CONTACT_INFO = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    text: "123 Nguyen Hue str, Dist 1, Ho Chi Minh City",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    text: "1800 6789",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    text: "contact@zenstyle.vn",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: "Monday - Sunday: 8:00 - 21:00",
  },
];

export default function Footer() {
  return (
    <footer
      className="
      bg-[var(--color-zen-primary)]
      text-[var(--color-zen-text-light)]
    "
    >
      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Slogan */}
          <div className="flex flex-col gap-4">
            <NavLink to="/" className="shrink-0">
              <img
                src="/ZenStyle.jpg"
                alt="zenstyle"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <span
                style={{ display: "none" }}
                className="font-[var(--font-logo)] font-semibold text-2xl tracking-wide bg-gradient-to-r from-[var(--color-zen-logo-from)] to-[var(--color-zen-logo-to)] bg-clip-text text-transparent border border-[var(--color-zen-logo-border)] rounded-sm px-3 py-1 inline-block"
              >
                ZenStyle
              </span>
            </NavLink>
            <p className="font-[var(--font-sans)] text-sm text-[var(--color-zen-text-muted)] leading-relaxed">
              A professional hair salon system, offering a premium experience.
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-4">
            <h4 className="font-[var(--font-logo)] text-base tracking-wider uppercase text-[var(--color-zen-accent)] pb-2 border-b border-[var(--color-zen-accent)]/30 ">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              {CONTACT_INFO.map((info, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--color-zen-accent)] mt-0.5">
                    {info.icon}
                  </span>
                  <span className="font-[var(--font-sans)] text-sm text-[var(--color-zen-text-muted)] leading-relaxed">
                    {info.text}{" "}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navbar links */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-[var(--font-logo)] text-base tracking-widest uppercase
              text-[var(--color-zen-accent)]
              pb-2 border-b border-[var(--color-zen-accent)]/30"
            >
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                        font-[var(--font-logo)] text-sm tracking-wide
                        transition-colors duration-200
                        flex items-center gap-2 group
                        ${
                          isActive
                            ? "text-[var(--color-zen-accent)]"
                            : "text-[var(--color-zen-text-muted)] hover:text-[var(--color-zen-accent)]"
                        }
                      `}
                  >
                    <span className="w-1 h-1 rounded-full shrink-0 bg-[var(--color-zen-accent)]/40 group-hover:bg-[var(--color-zen-accent)] transition-colors duration-200" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Google Map */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-[var(--font-logo)] text-base tracking-widest uppercase
              text-[var(--color-zen-accent)]
              pb-2 border-b border-[var(--color-zen-accent)]/30"
            >
              See Us
            </h4>
            <div className="w-full h-48 border border-[var(--color-zen-accent)]/30 overflow-hidden">
              <iframe
                title="ZenStyle Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4667768168!2d106.70232!3d10.77805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xc4b3a1a1a1a1a1a1!2zTmd1eeG7hW4gSHXhu4csIFF14bqtbiAxLCBUUC4gSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(20%)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p
              className="
              font-[var(--font-sans)] text-xs
              text-[var(--color-zen-text-muted)]
            "
            >
              123 Nguyen Hue Street, Distric 1, Ho Chi Minh city
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

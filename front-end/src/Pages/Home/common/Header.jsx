import { NavLink } from "react-router-dom";
import NavButton from "@/components/ui/NavButton";
import NavDropdown from "@/components/ui/NavDropdown";
import LoginButton from "@/components/ui/LoginButton";

const NAV_ITEMS = [
  { label: "ABOUT US", path: "/about-us", type: "link" },
  {
    label: "SERVICES",
    type: "dropdown",
    children: [
      { label: "Hair Styling", path: "/services/hair-styling" },
      { label: "Skin Care", path: "/services/skin-care" },
      { label: "Beauty Treatment", path: "/services/beauty-treatment" },
    ],
  },
  { label: "STAFF", path: "/staff", type: "link" },
  { label: "BOOKING", path: "/booking", type: "link" },
];

export default function Header() {
  return (
    <header className="top-0 z-50  border-b border-[var(--color-zen-accent-hover)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
        {/* ── Logo ── */}
        <NavLink to="/" className="shrink-0">
          <img
            src="/ZenStyle.jpg"
            alt="ZenStyle"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{ display: "none" }}></span>
        </NavLink>

        {/* ── Navbar ── */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-[3px]">
          {NAV_ITEMS.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <NavButton key={item.label} item={item} />
            ),
          )}
        </nav>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 shrink-0">
          <LoginButton onClick={() => console.log("login clicked")} />
        </div>
      </div>
    </header>
  );
}

import { NavLink } from "react-router-dom";
import NavButton from "@/components/ui/NavButton";
import NavDropdown from "@/components/ui/NavDropdown";
import AuthButtons from "@/components/Auth/AuthButtons";

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
    <header className="top-0 z-50 border-b border-[var(--color-zen-accent-hover)] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="shrink-0">
          <img
            src="/ZenStyle.jpg"
            alt="ZenStyle"
            className="h-12 w-auto object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </NavLink>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[3px] md:flex">
          {NAV_ITEMS.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <NavButton key={item.label} item={item} />
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}

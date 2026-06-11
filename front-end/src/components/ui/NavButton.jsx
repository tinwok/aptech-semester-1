import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NavButton({ item }) {
  return (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <Button
          variant="ghost"
          className={`rounded-sm w-32 h-10 font-[var(--font-logo)] text-base tracking-wide  text-[var(--color-zen-primary)] bg-[var(--color-zen-accent-hover)] ${isActive ? " text-[var(--color-zen-text-light)] bg-[var(--color-zen-accent-hover)]" : " hover:text-[var(--color-zen-primary)] hover:bg-[var(--color-zen-accent)] "}`}
        >
          {item.label}
        </Button>
      )}
    </NavLink>
  );
}

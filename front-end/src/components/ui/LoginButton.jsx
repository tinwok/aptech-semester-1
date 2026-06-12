import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <Link to="/login">
      <Button
        variant="secondary"
        size="lg"
        className="rounded-none w-32 h-10 border-[var(--color-zen-primary)]
      text-[var(--color-zen-primary)]
      bg-[var(--color-zen-accent)]
      hover:text-[var(--color-zen-primary)]
      hover:bg-[var(--color-zen-accent)]
      font-[var(--font-logo)] text-sm tracking-wide"
      >
        LOG IN
      </Button>
    </Link>
  );
}

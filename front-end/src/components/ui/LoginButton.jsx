import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
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
      <Link to="/login">LOG IN</Link>
    </Button>
  );
}

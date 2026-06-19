import { useLoaderData } from "react-router-dom";

const POSITION_STYLE = {
  stylist: {
    label: "Stylist",
    bg: "bg-[var(--color-zen-accent)]",
    text: "text-[var(--color-zen-primary)]",
  },
  barber: {
    label: "Barber",
    bg: "bg-[var(--color-zen-primary)]",
    text: "text-white",
  },
  receptionist: {
    label: "Receptionist",
    bg: "bg-[var(--color-zen-accent)]/30",
    text: "text-[var(--color-zen-primary)]",
  },
};

function StaffCard({ staff }) {
  const position = POSITION_STYLE[staff.position] ?? {
    label: staff.position,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  // Lấy initials từ tên
  const initials = staff.name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("");

  return (
    <div className="flex flex-col items-center bg-white border border-[var(--color-zen-accent)]/20 hover:border-[var(--color-zen-accent)] hover:shadow-xl transition-all duration-300 group p-8 text-center">
      {/* Avatar */}
      <div className="relative mb-6">
        {staff.image ? (
          <img
            src={staff.image}
            alt={staff.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-[var(--color-zen-accent)]"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-[var(--color-zen-accent)]/20 border-2 border-[var(--color-zen-accent)] flex items-center justify-center">
            <span className="font-[var(--font-logo)] text-3xl text-[var(--color-zen-accent)]">
              {initials}
            </span>
          </div>
        )}
        {/* Status dot */}
        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
      </div>

      {/* Name */}
      <h3 className="font-[var(--font-logo)] text-2xl font-semibold text-[var(--color-zen-primary)] mb-2">
        {staff.name}
      </h3>

      {/* Position badge */}
      <span
        className={`font-[var(--font-sans)] text-xs tracking-widest uppercase px-4 py-1 mb-6 ${position.bg} ${position.text}`}
      >
        {position.label}
      </span>

      {/* Info */}
      <div className="flex flex-col gap-3 w-full border-t border-[var(--color-zen-accent)]/20 pt-6">
        {/* Shift */}
        <div className="flex items-center gap-3 text-sm text-[var(--color-zen-primary)]/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0 text-[var(--color-zen-accent)]"
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
          <span className="font-[var(--font-sans)]">{staff.shift}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 text-sm text-[var(--color-zen-primary)]/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0 text-[var(--color-zen-accent)]"
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
          <span className="font-[var(--font-sans)]">{staff.phone}</span>
        </div>
      </div>
    </div>
  );
}

function StaffSkeleton() {
  return (
    <div className="flex flex-col items-center p-8 border border-[var(--color-zen-accent)]/20 animate-pulse">
      <div className="w-32 h-32 rounded-full bg-[var(--color-zen-accent)]/10 mb-6" />
      <div className="h-6 w-2/3 bg-[var(--color-zen-accent)]/10 rounded mb-3" />
      <div className="h-5 w-1/3 bg-[var(--color-zen-accent)]/10 rounded mb-6" />
      <div className="w-full border-t border-[var(--color-zen-accent)]/20 pt-6 flex flex-col gap-3">
        <div className="h-4 w-3/4 bg-[var(--color-zen-accent)]/10 rounded" />
        <div className="h-4 w-2/3 bg-[var(--color-zen-accent)]/10 rounded" />
      </div>
    </div>
  );
}

export default function StaffPage() {
  const { staffs } = useLoaderData();
  const isLoading = staffs.length === 0;

  return (
    <div className="text-[var(--color-zen-primary)]">
      {/* ── Hero Banner ── */}
      <div className="relative h-72 bg-[var(--color-zen-primary)] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="font-[var(--font-sans)] text-sm tracking-[0.3em] uppercase mb-3 text-[var(--color-zen-accent)]">
            Meet The Team
          </p>
          <h1 className="font-[var(--font-logo)] text-6xl font-semibold">
            Our Staff
          </h1>
        </div>
      </div>

      {/* ── Staff Grid ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <StaffSkeleton key={i} />)
            : staffs.map((staff) => <StaffCard key={staff.id} staff={staff} />)}
        </div>
      </section>
    </div>
  );
}

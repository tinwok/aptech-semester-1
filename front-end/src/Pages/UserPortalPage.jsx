import { Link, useLoaderData } from "react-router-dom";
import {
  CalendarDays,
  Gift,
  History,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";

function UserPortalPage() {
  const { user, basePath } = useLoaderData();

  const displayName = user?.name || user?.phone || user?.email || "Customer";
  const role = user?.role || "customer";

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-[#FFFDF8] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B89555]">
            ZENSTYLE PORTAL
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#2B2115]">
            Welcome, {displayName}
          </h1>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to={`${basePath}/profile`}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <UserRound className="h-9 w-9 text-[#B89555]" />
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">Profile</h2>
            <p className="mt-3 text-[#7B684A]">
              View and update your personal information.
            </p>
          </Link>

          <Link
            to={`${basePath}/appointments`}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <CalendarDays className="h-9 w-9 text-[#B89555]" />
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Appointments
            </h2>
            <p className="mt-3 text-[#7B684A]">
              Check your upcoming appointments.
            </p>
          </Link>

          <Link
            to={`${basePath}/service-history`}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <History className="h-9 w-9 text-[#B89555]" />
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Service History
            </h2>
            <p className="mt-3 text-[#7B684A]">
              Review your completed services.
            </p>
          </Link>

          <Link
            to={`${basePath}/change-password`}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Sparkles className="h-9 w-9 text-[#B89555]" />
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Account Security
            </h2>
            <p className="mt-3 text-[#7B684A]">
              Change your password.
            </p>
          </Link>
        </div>

        {role !== "staff" && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              to="/services"
              className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Scissors className="h-9 w-9 text-[#B89555]" />
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Recommended Services
              </h2>
            </Link>

            <Link
              to={`${basePath}/promotions`}
              className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Gift className="h-9 w-9 text-[#B89555]" />
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Promotions
              </h2>
            </Link>

            <Link
              to={`${basePath}/appointments`}
              className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <CalendarDays className="h-9 w-9 text-[#B89555]" />
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Quick Booking
              </h2>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserPortalPage;

import { Link, useLoaderData } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  FileText,
  History,
  KeyRound,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";

function UserPortalPage() {
  const { user, basePath } = useLoaderData();

  const displayName = user?.name || user?.phone || user?.email || "Customer";
  const role = user?.role || "customer";
  const isStaff = role === "staff";

  const cardClassName =
    "group flex min-h-52 flex-col rounded-3xl border border-[#E8D7B3] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C2A26A] hover:shadow-md";

  const iconClassName =
    "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7E6] text-[#B89555] transition group-hover:bg-[#B89555] group-hover:text-white";

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-[#E8D7B3] bg-[#FFFDF8] shadow-sm">
          <div className="bg-linear-to-r from-[#FFF7E6] to-white p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B89555]">
                  ZENSTYLE PORTAL
                </p>

                <h1 className="mt-3 text-4xl font-bold text-[#2B2115]">
                  Welcome, {displayName}
                </h1>

                <p className="mt-3 max-w-2xl text-[#7B684A]">
                  {isStaff
                    ? "Manage your profile, appointments, service history, notifications, and account settings in one place."
                    : "Manage your profile, appointments, service history, invoices, notifications, and account settings in one place."}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8D7B3] bg-white px-5 py-4 text-right shadow-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-[#B89555]">
                  Current Role
                </p>
                <p className="mt-1 text-lg font-bold capitalize text-[#2B2115]">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to={`${basePath}/profile`} className={cardClassName}>
            <div className={iconClassName}>
              <UserRound className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">Profile</h2>
            <p className="mt-3 flex-1 text-[#7B684A]">
              View and update your personal information.
            </p>
            <span className="mt-5 text-sm font-semibold text-[#B89555]">
              Open page →
            </span>
          </Link>

          <Link to={`${basePath}/appointments`} className={cardClassName}>
            <div className={iconClassName}>
              <CalendarDays className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Appointments
            </h2>
            <p className="mt-3 flex-1 text-[#7B684A]">
              Check your upcoming appointments.
            </p>
            <span className="mt-5 text-sm font-semibold text-[#B89555]">
              Open page →
            </span>
          </Link>

          <Link to={`${basePath}/service-history`} className={cardClassName}>
            <div className={iconClassName}>
              <History className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Service History
            </h2>
            <p className="mt-3 flex-1 text-[#7B684A]">
              Review your completed services.
            </p>
            <span className="mt-5 text-sm font-semibold text-[#B89555]">
              Open page →
            </span>
          </Link>

          {!isStaff && (
            <Link to={`${basePath}/invoice-details`} className={cardClassName}>
              <div className={iconClassName}>
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Invoice Details
              </h2>
              <p className="mt-3 flex-1 text-[#7B684A]">
                View paid invoices and appointment payment details.
              </p>
              <span className="mt-5 text-sm font-semibold text-[#B89555]">
                Open page →
              </span>
            </Link>
          )}

          <div className="flex min-h-52 flex-col justify-between rounded-3xl border border-[#E8D7B3] bg-[#FFF7E6] p-7 shadow-sm">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#B89555]">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                ZenStyle Care
              </h2>

              <p className="mt-3 text-[#7B684A]">
                {isStaff
                  ? "Please check your assigned appointments and support customers."
                  : "Please complete your service before making payment for your safety."}
              </p>
            </div>

            <p className="mt-5 text-sm font-semibold text-[#B89555]">
              {isStaff
                ? "Thank you for being part of ZenStyle."
                : "Thank you for choosing ZenStyle."}
            </p>
          </div>

          <Link to={`${basePath}/change-password`} className={cardClassName}>
            <div className={iconClassName}>
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Account Security
            </h2>
            <p className="mt-3 flex-1 text-[#7B684A]">
              Change your password and protect your account.
            </p>
            <span className="mt-5 text-sm font-semibold text-[#B89555]">
              Open page →
            </span>
          </Link>

          {!isStaff && (
            <Link to="/services" className={cardClassName}>
              <div className={iconClassName}>
                <Scissors className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Recommended Services
              </h2>
              <p className="mt-3 flex-1 text-[#7B684A]">
                Explore ZenStyle services and choose your favorite option.
              </p>
              <span className="mt-5 text-sm font-semibold text-[#B89555]">
                Open page →
              </span>
            </Link>
          )}

          {!isStaff && (
            <Link to="/booking" className={cardClassName}>
              <div className={iconClassName}>
                <CalendarDays className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
                Quick Booking
              </h2>
              <p className="mt-3 flex-1 text-[#7B684A]">
                Book your next appointment quickly and easily.
              </p>
              <span className="mt-5 text-sm font-semibold text-[#B89555]">
                Open page →
              </span>
            </Link>
          )}

          <Link to={`${basePath}/notifications`} className={cardClassName}>
            <div className={iconClassName}>
              <Bell className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2B2115]">
              Notifications
            </h2>
            <p className="mt-3 flex-1 text-[#7B684A]">
              View your latest notifications and important updates.
            </p>
            <span className="mt-5 text-sm font-semibold text-[#B89555]">
              Open page →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UserPortalPage;

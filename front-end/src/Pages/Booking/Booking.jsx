import { useAuth } from "@/context/AuthContext";
import BookingForm from "./BookingForm";

function Booking() {
  const { user } = useAuth();

  if (!user || user.role !== "customer") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-[#E8D7B3] bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#2B2115]">
            Booking unavailable
          </h1>

          <p className="mt-4 text-lg text-[#7B684A]">
            Please sign in as a customer first!
          </p>
        </div>
      </section>
    );
  }

  return <BookingForm customerId={user.customer?.id} endpoint="book" />;
}

export default Booking;

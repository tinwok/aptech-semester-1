import { useAuth } from "@/context/AuthContext";
import BookingForm from "./BookingForm";

function Booking() {
  const { user } = useAuth();

  if (!user?.customer?.id) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-[#2B2115]">
          Please sign in as a customer first.
        </h1>
      </div>
    );
  }

  return <BookingForm customerId={user.customer.id} endpoint="book" />;
}

export default Booking;

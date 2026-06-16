import { useAuth } from "@/context/AuthContext";
import BookingForm from "./BookingForm";
function Booking() {
  const { user } = useAuth();
  console.log(user.customer.id);

  return <BookingForm customerId={user.customer.id} endpoint="book" />;
}

export default Booking;

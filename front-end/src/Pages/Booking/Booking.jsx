import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeftFromLine } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

function Booking() {
  const { user } = useAuth();

  const [staffs, setStaffs] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const totalPrice = selectedServices.reduce((total, item) => {
    const service = services.find((s) => s.id === item.service_id);
    return total + Number(service?.price || 0);
  }, 0);

  const selectedStaff = staffs.find(
    (staff) => String(staff.id) === String(staffId),
  );

  const resetForm = () => {
    setSelectedServices([]);
    setSelectedTime(null);
    setAvailableSlots([]);
    setAppointmentDate("");
    setStaffId("");
    setNote("");
  };

  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleBooking = async () => {
    try {
      if (!user?.customer?.id) {
        return alert("Customer information not found. Please sign in again.");
      }

      if (!selectedTime) {
        return alert("Please choose a time slot");
      }

      if (selectedServices.length === 0) {
        return alert("Please choose at least one service");
      }

      const payload = {
        customer_id: user.customer.id,
        staff_id: selectedTime?.staff_id || staffId || null,
        payment_id: null,
        appointment_date: appointmentDate,
        start_time: selectedTime.time.substring(0, 5),
        note,
        services: selectedServices,
      };

      console.log("Booking payload:", payload);

      await api.post("/book", payload);

      toast.success("Booking successful!");
      resetForm();
    } catch (error) {
      console.log("Booking error:", error.response?.data || error);
      toast.warning(error.response?.data?.message || "Booking failed!");
    }
  };

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.service_id === service.id);

      if (exists) {
        return prev.filter((item) => item.service_id !== service.id);
      }

      return [
        ...prev,
        {
          service_id: service.id,
        },
      ];
    });
  };

  const days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }),
    };
  });

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await api.get("/staffs");
        setStaffs(res.data.data || res.data || []);
      } catch (error) {
        console.log(error.response?.data?.message || error);
      }
    };

    fetchStaffs();
  }, []);

  useEffect(() => {
    if (!appointmentDate || selectedServices.length === 0) return;

    const fetchAvailableTime = async () => {
      try {
        const res = await api.post("/available-times", {
          staff_id: staffId ? staffId : null,
          appointment_date: appointmentDate,
          services: selectedServices,
        });

        setAvailableSlots(res.data.slots ?? res.data);
      } catch (error) {
        console.log(error.response?.data || error);
      }
    };

    fetchAvailableTime();
  }, [staffId, appointmentDate, selectedServices]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data || res.data || []);
      } catch (error) {
        console.log(error.response?.data || error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-blue-900">
        Booking
      </h1>

      <Link
        to="/"
        className="flex items-center justify-center gap-2 font-semibold text-blue-900 hover:text-red-900"
      >
        <ArrowLeftFromLine />
        <span>Back to mainpage</span>
      </Link>

      <div className="mx-auto max-w-[700px] rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 font-semibold text-blue-800">
          1. Booking date and stylist
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            value={staffId || "any"}
            onValueChange={(value) => {
              setStaffId(value === "any" ? "" : value);
              setSelectedTime(null);
              setAvailableSlots([]);
            }}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Any Stylist (Random)" />
            </SelectTrigger>

            <SelectContent className="p-2">
              <SelectItem value="any">Any Stylist (Random)</SelectItem>

              {staffs.map((staff) => (
                <SelectItem key={staff.id} value={String(staff.id)}>
                  {staff.users?.name || staff.user?.name || "Unnamed Staff"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={appointmentDate}
            onValueChange={(value) => {
              setAppointmentDate(value);
              setSelectedTime(null);
              setAvailableSlots([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Date" />
            </SelectTrigger>

            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 font-semibold text-blue-800">
            2. Available Times
          </h3>

          {availableSlots.length === 0 ? (
            <p className="text-sm text-gray-500">
              Please choose stylist, date, and service.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  disabled={!slot.available}
                  variant={
                    selectedTime?.time === slot.time ? "default" : "outline"
                  }
                  onClick={() => setSelectedTime(slot)}
                  className="cursor-pointer hover:text-white"
                >
                  {slot.time.substring(0, 5)}
                </Button>
              ))}
            </div>
          )}
        </div>

        {selectedTime && (
          <div className="mt-6 rounded bg-slate-100 p-4">
            <p>
              <strong>Staff:</strong>{" "}
              {selectedStaff?.users?.name ||
                selectedStaff?.user?.name ||
                "Random Stylist"}
            </p>

            <p>
              <strong>Date:</strong> {appointmentDate}
            </p>

            <p>
              <strong>Time:</strong> {selectedTime.time}
            </p>
          </div>
        )}

        <div className="mb-6 mt-8">
          <h3 className="mb-3 font-semibold text-blue-800">
            3. Choose Services
          </h3>

          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {services.map((service) => {
                const selected = selectedServices.some(
                  (item) => item.service_id === service.id,
                );

                return (
                  <CarouselItem
                    key={service.id}
                    className="h-[400px] w-full md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                  >
                    <Card
                      className={`relative mx-auto mt-2 w-full max-w-sm cursor-pointer pt-0 transition-all duration-200 will-change-transform hover:scale-[1.02] ${
                        selected ? "ring-2 ring-blue-600" : ""
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      <div className="absolute inset-0 z-30 aspect-video" />

                      <img
                        src={
                          service.image_url ||
                          "https://avatar.vercel.sh/shadcn1"
                        }
                        alt={service.title}
                        className="relative z-20 aspect-video h-[200px] w-full object-cover"
                      />

                      <CardHeader className="flex-1">
                        <CardTitle className="w-full truncate">
                          {service.title}
                        </CardTitle>
                        <CardTitle>{formatVND(service.price)}</CardTitle>
                      </CardHeader>

                      <CardFooter className="flex flex-col justify-center">
                        <CardAction className="w-full text-center">
                          <Badge variant={selected ? "default" : "secondary"}>
                            {selected ? "Selected" : "Service"}
                          </Badge>
                        </CardAction>

                        <Button>{service.duration_minutes} Minutes</Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-semibold">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border p-3"
            rows={3}
            placeholder="Enter booking note..."
          />
        </div>

        <div className="mt-4">
          <p className="font-semibold">Selected Services:</p>

          <Table>
            <TableCaption>A list of your selected services.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedServices.map((item, index) => {
                const service = services.find((s) => s.id === item.service_id);

                return (
                  <TableRow key={item.service_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{service?.title}</TableCell>
                    <TableCell className="text-right">
                      {Number(service?.price || 0).toLocaleString("vi-VN")} đ
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="text-left font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleBooking}
              disabled={
                !appointmentDate ||
                !selectedTime ||
                selectedServices.length === 0
              }
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;

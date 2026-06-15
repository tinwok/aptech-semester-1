import { useEffect, useState } from "react";
import api from "@/services/api";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { redirect } from "react-router-dom";
function Booking() {
  const { user } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");

  // Sau này lấy từ giỏ dịch vụ
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
    setSelectedServices([]);
  };
  // -----------Format VND
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  // ------------- Send Request
  const handleBooking = async () => {
    try {
      const payload = {
        customer_id: user.customer.id,
        staff_id: selectedTime?.staff_id || staffId,
        appointment_date: appointmentDate,
        start_time: selectedTime.time.substring(0, 5),
        note,
        services: selectedServices,
      };
      if (!selectedTime) {
        return alert("Please choose a time slot");
      }

      if (selectedServices.length === 0) {
        return alert("Please choose at least one service");
      }

      const res = await api.post("/book", payload);

      toast.success("Booking successful!");
      resetForm();
      redirect("/");
    } catch (error) {
      console.log(error.response?.data || error);
      toast.warning("Booking failed!");
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
  // tạo 7 ngày tiếp theo
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

  // load nhân viên
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await api.get("/staffs");

        setStaffs(res.data.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchStaffs();
  }, []);

  // load giờ trống
  useEffect(() => {
    if (!appointmentDate || selectedServices.length === 0) return;

    const fetchAvailableTime = async () => {
      try {
        const res = await api.post("available-times", {
          staff_id: staffId ? staffId : null,
          appointment_date: appointmentDate,
          services: selectedServices,
        });

        setAvailableSlots(res.data.slots ?? res.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchAvailableTime();
  }, [staffId, appointmentDate, selectedServices]);
  // chon dich vu
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");

        setServices(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchServices();
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Booking
      </h1>

      <div className="max-w-[700px] mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">
          1. Booking date and stylist
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Chọn nhân viên */}
          <Select
            value={staffId || ""}
            onValueChange={(value) => setStaffId(value)}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue>
                {staffId
                  ? staffs.find((s) => String(s.id) === String(staffId))?.users
                      ?.name
                  : "Choose Stylist"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="p-2">
              <SelectItem value="any">Any Stylist (Random)</SelectItem>

              {staffs.map((staff) => (
                <SelectItem key={staff.id} value={String(staff.id)}>
                  {staff.users.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Chọn ngày */}
          <Select value={appointmentDate} onValueChange={setAppointmentDate}>
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

        {/* Time slots */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Available Times</h3>

          {availableSlots.length === 0 ? (
            <p className="text-sm text-gray-500">
              Please choose stylist and date
            </p>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
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

        {/* Kết quả chọn */}
        {selectedTime && (
          <div className="mt-6 p-4 bg-slate-100 rounded">
            <p>
              <strong>Staff:</strong>{" "}
              {selectedStaff?.users?.name || "Random Stylist"}
            </p>

            <p>
              <strong>Date:</strong> {appointmentDate}
            </p>

            <p>
              <strong>Time:</strong> {selectedTime.time}
            </p>
          </div>
        )}
        {/* chon service */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Choose Services</h3>
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
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3 w-[90%] h-[400px]"
                  >
                    <Card
                      className={`relative mx-auto w-full h-[350px] max-w-sm pt-0 mt-2   cursor-pointer transition-all duration-200 will-change-transform hover:scale-[1.02] ${selected ? "ring-2 ring-blue-600" : ""}`}
                      onClick={() => toggleService(service)}
                    >
                      <div className="absolute inset-0 z-30 aspect-video " />
                      <img
                        src={
                          service.image_url ||
                          "https://avatar.vercel.sh/shadcn1"
                        }
                        alt="Event cover"
                        className="relative z-20 aspect-video w-full object-cover   "
                      />
                      <CardHeader className="flex-1 ">
                        <CardTitle className="w-full truncate">
                          {service.title}
                        </CardTitle>
                        <CardTitle>{formatVND(service.price)}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex flex-col justify-center ">
                        <CardAction className="text-center w-full">
                          <Badge variant={selected ? "default" : "secondary"}>
                            {selected ? "Selected" : "Service"}
                          </Badge>
                        </CardAction>
                        <Button className="">
                          {service.duration_minutes} Minutes
                        </Button>
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
          <label className="block mb-2 font-semibold">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-md p-3"
            rows={3}
            placeholder="Enter booking note..."
          />
        </div>
        <div className="mt-4">
          <p className="font-semibold">Selected Services:</p>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">STT</TableHead>

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
                <TableCell colSpan={2} className="font-bold text-left">
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

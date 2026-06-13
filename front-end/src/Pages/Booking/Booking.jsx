import { useEffect, useState } from "react";
import api from "@/services/api";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Booking() {
  const [staffs, setStaffs] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  // Sau này lấy từ giỏ dịch vụ
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
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
    if (!staffId || !appointmentDate || selectedServices.length === 0) return;

    const fetchAvailableTime = async () => {
      try {
        const res = await api.post("available-times", {
          staff_id: staffId,
          appointment_date: appointmentDate,
          services: selectedServices,
        });

        setAvailableSlots(res.data.slots ?? res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAvailableTime();
  }, [staffId, appointmentDate, selectedServices]);
  // chon dich vu
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        console.log(res);

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
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Choose Stylist" />
            </SelectTrigger>

            <SelectContent className="p-2">
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
              <strong>Staff:</strong> {staffId}
            </p>

            <p>
              <strong>Date:</strong> {appointmentDate}
            </p>

            <p>
              <strong>Time:</strong> {selectedTime.time}
            </p>
          </div>
        )}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Choose Services</h3>

          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const selected = selectedServices.some(
                (item) => item.service_id === service.id,
              );

              return (
                <Button
                  key={service.id}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  onClick={() => toggleService(service)}
                >
                  {service.title}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Selected Services:</p>

          {selectedServices.map((item) => {
            const service = services.find((s) => s.id === item.service_id);

            return <p key={item.service_id}>{service?.title}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Booking;

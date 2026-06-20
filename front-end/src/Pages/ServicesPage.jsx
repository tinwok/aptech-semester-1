import { useEffect, useState } from "react";
import { Clock, Scissors } from "lucide-react";
import { getServicesApi } from "@/services/serviceService";

const SERVICE_IMAGES = {
  "Men Haircut": "/images/services/haircuttingclassic.png",
  "Women Haircut": "/images/services/haircuttinglayer.png",
  "Hair Wash": "/images/services/beauty_hairwash.png",
  "Hair Coloring": "/images/services/haircoloring.png",
  "Hair Highlight": "/images/services/haircoloring.png",
  "Hair Perm": "/images/services/haircuttinglayer.png",
  "Hair Straightening": "/images/services/haircuttingclassic.png",
  "Hair Spa": "/images/services/beauty_hairwash.png",
  "Hair Recovery Treatment": "/images/services/beauty_hairwash.png",
  "Beard Trim": "/images/services/haircuttingundercut.png",
};

function formatMoney(value) {
  if (!value) return "Liên hệ";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getServicesApi(page);

        setServices(data.data || []);
        setPagination(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách dịch vụ.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, [page]);

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            ZenStyle Services
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">
            Dịch vụ làm đẹp
          </h1>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6">
            Đang tải dịch vụ...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && services.length === 0 && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <Scissors className="mx-auto h-12 w-12 text-[#B89555]" />
            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              Chưa có dịch vụ
            </h2>
            <p className="mt-2 text-[#7B684A]">
              Khi admin thêm dịch vụ, danh sách sẽ hiển thị ở đây.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageSrc = service.image_url ?? SERVICE_IMAGES[service.title];

            return (
              <article
                key={service.id}
                className="overflow-hidden rounded-3xl border border-[#E8D7B3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-48 items-center justify-center bg-[#FFF2D8]">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Scissors className="h-14 w-14 text-[#B89555]" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-[#2B2115]">
                      {service.title}
                    </h2>

                    <span className="rounded-full bg-[#FFF2D8] px-3 py-1 text-xs font-semibold capitalize text-[#8A6A35]">
                      {service.status || "active"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#7B684A]">
                    {service.description || "Chưa có mô tả cho dịch vụ này."}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E8D7B3] pt-4">
                    <p className="font-bold text-[#B89555]">
                      {formatMoney(service.price)}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-[#7B684A]">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes || 0} phút</span>
                    </div>
                  </div>

                  {service.note && (
                    <p className="mt-3 rounded-xl bg-[#FFF7E6] p-3 text-sm text-[#7B684A]">
                      {service.note}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-2 text-[#2B2115] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trang trước
            </button>

            <span className="text-sm font-medium text-[#8A6A35]">
              Trang {pagination.current_page} / {pagination.last_page}
            </span>

            <button
              type="button"
              disabled={page >= pagination.last_page}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-2 text-[#2B2115] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesPage;

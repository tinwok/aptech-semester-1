import { Gift } from "lucide-react";

function PromotionsPage() {
  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
        <Gift className="h-10 w-10 text-[#B89555]" />
        <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
          Ưu đãi / Khuyến mãi
        </h1>
        <p className="mt-2 text-[#7B684A]">
          Đây là trang promotion thuộc phần của bạn. Backend chưa có API
          promotion user, nên trước mắt làm giao diện sẵn.
        </p>
      </div>
    </section>
  );
}

export default PromotionsPage;

import { Package } from "lucide-react";

function OrdersPage() {
  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
        <Package className="h-10 w-10 text-[#B89555]" />
        <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">Đơn hàng</h1>
        <p className="mt-2 text-[#7B684A]">
          Backend hiện chưa có API riêng cho đơn hàng của user. Tạm thời trang
          này giữ giao diện để sau này gắn API.
        </p>
      </div>
    </section>
  );
}

export default OrdersPage;

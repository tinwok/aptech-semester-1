import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PLACEHOLDER = "/images/placeholder.png";

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

const PRODUCT_IMAGES = {
  "Shampoo Argan Oil": "/images/services/beauty_hairwash.png",
  "Conditioner Keratin": "/images/services/skinmoituring.png",
  "Hair Mask Treatment": "/images/services/haircuttinglayer.png",
  "Hair Wax Pomade": "/images/services/haircuttingundercut.png",
  "Hair Spray Hold": "/images/services/haircoloring.png",
  "Hair Serum": "/images/services/beauty_hairwash.png",
  "Face Wash": "/images/services/white_skin.png",
  "Toner Rose Water": "/images/services/white_skin.png",
  "Moisturizer SPF": "/images/services/skinmoituring.png",
  "Eye Cream Collagen": "/images/services/white_skin.png",
};

export default function ServiceCard({ item, moreInfoLink, size }) {
  const isSmall = size === "small";

  const imageSrc =
    item.image ??
    item.image_url ??
    SERVICE_IMAGES[item.name] ??
    PRODUCT_IMAGES[item.name] ??
    PLACEHOLDER;

  return (
    <div
      className={`relative flex h-full flex-col border-2 border-[var(--color-zen-accent)] overflow-hidden hover:shadow-xl hover:shadow-black/20 hover:scale-[1.03] hover:z-10 transition-all duration-300 group ${
        isSmall ? "w-44" : "w-full"
      }`}
    >
      {/* Image */}
      <div className={`w-full overflow-hidden ${isSmall ? "h-36" : "h-52"}`}>
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Text */}
      <div
        className={`flex flex-col flex-1 bg-white ${
          isSmall ? "p-3 gap-2" : "p-4 gap-3"
        }`}
      >
        <h3
          className={`font-[var(--font-logo)] font-semibold text-[var(--color-zen-primary)] tracking-wide ${
            isSmall ? "text-sm line-clamp-1" : "text-lg line-clamp-2"
          }`}
        >
          {item.name}
        </h3>

        {item.description ? (
          <p
            className={`font-[var(--font-sans)] text-sm text-[var(--color-zen-primary)]/70 flex-1 ${
              isSmall ? "line-clamp-2" : "line-clamp-3"
            }`}
          >
            {item.description}
          </p>
        ) : item.unit ? (
          <p className="font-[var(--font-sans)] text-sm text-[var(--color-zen-primary)]/70 flex-1">
            Unit: {item.unit}
          </p>
        ) : null}

        {item.duration_minutes && (
          <div className="flex items-center gap-1 text-[var(--color-zen-text-muted)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`shrink-0 ${isSmall ? "w-3 h-3" : "w-4 h-4"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={`font-[var(--font-sans)] ${
                isSmall ? "text-[10px]" : "text-xs"
              }`}
            >
              {item.duration_minutes} minutes
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--color-zen-accent)]/30">
          <span
            className={`font-[var(--font-logo)] font-semibold text-[var(--color-zen-accent)] ${
              isSmall ? "text-xs" : "text-base"
            }`}
          >
            {item.price.toLocaleString("vi-VN")}đ
          </span>

          <Button
            className={`rounded-none bg-[var(--color-zen-accent)] text-[var(--color-zen-primary)] hover:bg-[var(--color-zen-accent-hover)] font-[var(--font-logo)] tracking-widest uppercase border-none ${
              isSmall ? "px-2 h-6 text-[10px]" : "px-4 h-8 text-xs"
            }`}
          >
            <Link to={moreInfoLink}>{isSmall ? "Detail" : "More Info"}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

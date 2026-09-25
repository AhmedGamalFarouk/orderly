import { useFormatMoney } from "../utils/currencyContext";
import Counter from "./Counter";
import { FoodCategoryIcon } from "../assets/icons/icons";

export default function OrderItem({ menu, disabled = false }) {
  const formatCurrency = useFormatMoney();
  return (
    <>
      {menu.map((m, ind) => {
        return (
          <div
            key={m.id ?? ind}
            className="group bg-white rounded-2xl border border-base-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
          >
            {/* Image or Food Category Graphic */}
            <div className="w-full h-44 bg-base-200/50 flex items-center justify-center relative overflow-hidden border-b border-base-200/60">
              {m.imageUrl ? (
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-neutral/80 p-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <FoodCategoryIcon
                      type={`${m.name} ${m.description || ""}`}
                      className="w-10 h-10 text-primary"
                    />
                  </div>
                  <span className="text-xs font-body font-medium text-neutral/70 uppercase tracking-wider">
                    Fresh & Prepared
                  </span>
                </div>
              )}
              {/* Price Tag Pill */}
              <div className="absolute top-3 right-3 bg-base-100/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-xs border border-base-200">
                {formatCurrency(m.price)}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-heading text-lg font-bold text-base-content leading-snug line-clamp-1 mb-1">
                {m.name}
              </h3>
              <p className="font-body text-xs text-neutral leading-relaxed line-clamp-2 mb-4 flex-grow">
                {m.description || "Freshly made to order for your group."}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-base-200/50 mt-auto">
                <span className="font-body text-xs font-semibold text-neutral/70">
                  Select Qty
                </span>
                <Counter id={m.id} disabled={disabled}>
                  <Counter.Decrement />
                  <Counter.Count />
                  <Counter.Increment />
                </Counter>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

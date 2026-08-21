import { useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatCurrency";
import { CopyIcon, FoodCategoryIcon, SparklesIcon, ArrowRightIcon } from "../assets/icons/icons";
import { handleToast, handleError } from "./alerts";

export default function RecentOrder({
  id,
  spaceName,
  restaurantName,
  date = "Recent",
  total = 0,
  status = "active",
  hasFinalizedOrder = false,
}) {
  const navigate = useNavigate();
  const isFinalized = status === "finalized" || hasFinalizedOrder;
  const roomUrl = `${window.location.origin}/space/${id}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!navigator.clipboard?.writeText) {
      handleError("Clipboard unavailable.");
      return;
    }
    navigator.clipboard
      .writeText(roomUrl)
      .then(() => handleToast("Room link copied!"))
      .catch(() => handleError("Could not copy link."));
  };

  const handleCardClick = () => {
    navigate(isFinalized ? `/finalized-order/${id}` : `/space/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-5 border border-base-200 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FoodCategoryIcon type={restaurantName || spaceName || "food"} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
                {restaurantName || spaceName || `Space #${id}`}
              </h3>
              <p className="text-xs font-body text-neutral/70 font-mono">
                ID: #{id}
              </p>
            </div>
          </div>

          <span
            className={`badge badge-sm font-semibold text-xs ${
              isFinalized
                ? "badge-neutral text-neutral-content"
                : "badge-secondary text-secondary-content"
            }`}
          >
            {isFinalized ? "Finalized" : "Active"}
          </span>
        </div>

        {spaceName && restaurantName && (
          <p className="text-xs text-neutral font-body line-clamp-1 mb-4">
            {spaceName}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-base-200/60 flex items-center justify-between mt-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral/70">
            {date}
          </span>
          <span className="font-body text-base font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Copy room link"
            onClick={handleCopy}
            className="btn btn-ghost btn-xs btn-circle text-neutral hover:text-primary hover:bg-primary/10"
            title="Copy room link"
          >
            <CopyIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCardClick}
            className="btn btn-primary btn-xs px-3 rounded-lg font-medium gap-1"
          >
            {isFinalized ? "Receipt" : "Open"}
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

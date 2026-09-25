import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency";
import { setQuantity } from "../../features/slices/singlemenu";

export default function MySelection() {
  const { arr, total } = useSelector((state) => state.single);
  const dispatch = useDispatch();
  const selectedItems = arr.filter((item) => item.quantity > 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-base-content">
          My Selection
        </h3>
        <span className="text-xs font-bold text-primary px-2.5 py-0.5 bg-primary/10 rounded-full">
          {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
        {selectedItems.length === 0 ? (
          <div className="text-center py-5 px-3 bg-base-200/40 rounded-xl border border-dashed border-base-300/60">
            <p className="text-xs text-neutral">
              You haven't selected any items yet. Tap '+' on any dish to add.
            </p>
          </div>
        ) : (
          selectedItems.map((item) => {
            return (
              <div
                key={item.id}
                className="flex justify-between items-center p-2.5 rounded-xl bg-base-200/50 hover:bg-base-200/80 transition-colors border border-base-200"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-body text-sm font-semibold text-base-content truncate">
                    {item.name}
                  </span>
                  <span className="font-body text-xs text-neutral">
                    {item.quantity} × {formatCurrency(item.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-body text-sm font-bold text-primary">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="btn btn-ghost btn-xs btn-circle text-neutral hover:text-error hover:bg-error/10"
                    onClick={() => dispatch(setQuantity({ id: item.id, quantity: 0 }))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-base-200 flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral">
          My Total
        </span>
        <span className="font-body text-base font-bold text-base-content">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}


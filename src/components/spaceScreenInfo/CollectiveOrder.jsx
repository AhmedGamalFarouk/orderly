import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/formatCurrency";
import { ReceiptIcon } from "../../assets/icons/icons";

export default function CollectiveOrder() {
  const participants = useSelector((state) => state.participants);
  const menuItems = Object.values(
    participants.reduce((items, participant) => {
      (participant.selectedItems || []).forEach((selected) => {
        const id = selected.itemId ?? selected.name;
        const current = items[id] || {
          id,
          name: selected.name || "Unnamed item",
          price: Number(selected.price) || 0,
          quantity: 0,
        };
        current.quantity += Number(selected.quantity || 0);
        items[id] = current;
      });
      return items;
    }, {})
  );
  const total = menuItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalItemCount = menuItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-base-content">
            Collective Room Total
          </h3>
        </div>
        <span className="text-xs font-semibold text-neutral px-2.5 py-0.5 bg-base-200 rounded-full">
          {totalItemCount} total items
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2.5 rounded-xl bg-base-200/40 hover:bg-base-200/70 transition-colors border border-base-200/50"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-body text-sm font-semibold text-base-content truncate">
                  {item.name}
                </span>
                <span className="font-body text-xs text-neutral">
                  {item.quantity} × {formatCurrency(item.price)}
                </span>
              </div>
              <span className="font-body text-sm font-bold text-base-content shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-5 px-3 bg-base-200/40 rounded-xl border border-dashed border-base-300/60">
            <p className="text-xs text-neutral">No items in the group order yet.</p>
          </div>
        )}
      </div>

      <div className="p-3.5 bg-primary/10 rounded-xl border border-primary/20 flex justify-between items-center mt-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider uppercase text-primary font-body">
            Room Grand Total
          </span>
          <span className="text-xs text-neutral/80 font-body">
            All participants combined
          </span>
        </div>
        <span className="font-heading text-xl font-extrabold text-primary">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}


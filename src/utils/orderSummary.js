const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const toCents = (value) => Math.round(toNumber(value) * 100);

// Build the per-participant and consolidated order from stored selections.
// Prices always come from the menu when the item is found there, so a
// client-supplied price on a selection is only a fallback.
export function summarizeOrders(participants = [], menuItems = []) {
  const menuById = new Map(
    menuItems.flatMap((item) => [
      [String(item.id), item],
      ...(item.legacyId !== undefined ? [[String(item.legacyId), item]] : []),
    ])
  );

  const participantOrders = participants
    .map((participant) => {
      const items = (participant.selectedItems || [])
        .map((selected) => {
          const menuItem = menuById.get(String(selected.itemId));
          const qty = toNumber(selected.quantity ?? selected.qty);
          const price = toNumber(menuItem?.price ?? selected.price);
          return {
            itemId: String(menuItem?.id ?? selected.itemId ?? selected.name),
            qty,
            itemName: menuItem?.name || selected.name || "Unnamed item",
            pricePerItem: price,
            subtotal: qty * price,
          };
        })
        .filter((item) => item.qty > 0);
      const name = participant.name || "Participant";
      return {
        name,
        initials: name.trim().slice(0, 1).toUpperCase(),
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0),
      };
    })
    .filter((participant) => participant.items.length > 0);

  // Group by menu item id so two dishes sharing a name stay separate lines.
  const collectiveById = new Map();
  participantOrders.forEach((participant) =>
    participant.items.forEach((item) => {
      const current = collectiveById.get(item.itemId) || { ...item, qty: 0, subtotal: 0 };
      current.qty += item.qty;
      current.subtotal += item.subtotal;
      collectiveById.set(item.itemId, current);
    })
  );
  const collectiveOrder = [...collectiveById.values()];
  const grandTotal = collectiveOrder.reduce((sum, item) => sum + item.subtotal, 0);

  return { participantOrders, collectiveOrder, grandTotal };
}

// Split extra fees (delivery, tip) between participants, either equally or in
// proportion to each participant's food total. Works in cents and hands any
// leftover cents to the largest remainders so the shares add up exactly.
export function splitExtraFees(participantTotals = [], extraFees = 0, mode = "proportional") {
  const extraCents = Math.max(0, toCents(extraFees));
  const count = participantTotals.length;
  if (!count || !extraCents) return participantTotals.map(() => 0);

  const totals = participantTotals.map((total) => Math.max(0, toCents(total)));
  const foodCents = totals.reduce((sum, total) => sum + total, 0);
  const weights = mode === "equal" || !foodCents ? totals.map(() => 1) : totals;
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  const raw = weights.map((weight) => (extraCents * weight) / weightSum);
  const shares = raw.map(Math.floor);
  let leftover = extraCents - shares.reduce((sum, share) => sum + share, 0);
  raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)
    .forEach(({ index }) => {
      if (leftover > 0) {
        shares[index] += 1;
        leftover -= 1;
      }
    });

  return shares.map((cents) => cents / 100);
}

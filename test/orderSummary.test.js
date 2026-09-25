import test from "node:test";
import assert from "node:assert/strict";
import { splitExtraFees, summarizeOrders } from "../src/utils/orderSummary.js";

const menu = [
  { id: "latte-s", name: "Latte", price: 3 },
  { id: "latte-l", name: "Latte", price: 5 },
  { id: "croissant", legacyId: 7, name: "Croissant", price: 2.5 },
];

test("summarizeOrders uses menu prices and keeps same-named items apart", () => {
  const { participantOrders, collectiveOrder, grandTotal } = summarizeOrders(
    [
      { name: "Alex", selectedItems: [{ itemId: "latte-s", quantity: 1, price: 999 }] },
      { name: "Sam", selectedItems: [{ itemId: "latte-l", quantity: 2 }, { itemId: 7, quantity: 1 }] },
      { name: "Idle", selectedItems: [{ itemId: "latte-s", quantity: 0 }] },
    ],
    menu
  );

  assert.equal(participantOrders.length, 2);
  assert.equal(participantOrders[0].total, 3);
  assert.equal(participantOrders[1].total, 12.5);
  assert.deepEqual(
    collectiveOrder.map(({ itemName, qty, pricePerItem, subtotal }) => [itemName, qty, pricePerItem, subtotal]),
    [
      ["Latte", 1, 3, 3],
      ["Latte", 2, 5, 10],
      ["Croissant", 1, 2.5, 2.5],
    ]
  );
  assert.equal(grandTotal, 15.5);
});

test("splitExtraFees shares always add up to the exact fee", () => {
  const equal = splitExtraFees([10, 20, 30], 10, "equal");
  assert.deepEqual(equal, [3.34, 3.33, 3.33]);

  const proportional = splitExtraFees([10, 20, 30], 10, "proportional");
  assert.equal(Math.round(proportional.reduce((a, b) => a + b, 0) * 100), 1000);
  assert.deepEqual(proportional, [1.67, 3.33, 5]);
});

test("splitExtraFees handles empty and zero-food cases", () => {
  assert.deepEqual(splitExtraFees([], 5), []);
  assert.deepEqual(splitExtraFees([10, 20], 0), [0, 0]);
  assert.deepEqual(splitExtraFees([0, 0], 5, "proportional"), [2.5, 2.5]);
});

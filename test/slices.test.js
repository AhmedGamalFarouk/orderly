import test from "node:test";
import assert from "node:assert/strict";
import singlemenuReducer, { resetMenu, setMenu, setQuantity } from "../src/features/slices/singlemenu.js";
import collectiveReducer, { setCollectiveOrders, clearCollectiveOrders } from "../src/features/slices/collectiveOrderReducer.js";

test("single menu tracks item quantity and total", () => {
  let state = singlemenuReducer(undefined, setMenu({ id: "burger", name: "Burger", price: "10" }));
  state = singlemenuReducer(state, setMenu({ id: "legacy-burger", legacyId: 7, name: "Legacy Burger", price: 3 }));
  assert.equal(state.arr[1].legacyId, 7);
  state = singlemenuReducer(state, setQuantity({ id: "burger", quantity: 2 }));

  assert.equal(state.arr[0].quantity, 2);
  assert.equal(state.total, 20);

  state = singlemenuReducer(state, setQuantity({ id: "burger", quantity: -4 }));
  assert.equal(state.arr[0].quantity, 0);
  assert.equal(state.total, 0);

  state = singlemenuReducer(state, resetMenu());
  assert.deepEqual(state, { arr: [], total: 0, userId: -1 });
});

test("single menu quantities are keyed by item id, not position", () => {
  let state = singlemenuReducer(undefined, setMenu({ id: "burger", name: "Burger", price: 10 }));
  state = singlemenuReducer(state, setMenu({ id: "shake", name: "Shake", price: 4 }));
  state = singlemenuReducer(state, setQuantity({ id: "shake", quantity: 3 }));

  assert.equal(state.arr[0].quantity, 0);
  assert.equal(state.arr[1].quantity, 3);
  assert.equal(state.total, 12);
});

test("collective total recalculates and clears", () => {
  const orders = [{ selectedItems: [{ id: "burger", qty: 2, price: 10 }] }];
  let state = collectiveReducer(undefined, setCollectiveOrders(orders));
  assert.equal(state.grandTotal, 20);

  state = collectiveReducer(state, setCollectiveOrders(orders));
  assert.equal(state.grandTotal, 20);

  state = collectiveReducer(state, clearCollectiveOrders());
  assert.equal(state.grandTotal, 0);
});

test("collective totals ignore malformed orders", () => {
  const state = collectiveReducer(undefined, setCollectiveOrders([
    null,
    { selectedItems: null },
    { selectedItems: [{ id: "valid", qty: "2", price: "4" }, { qty: 9, price: 99 }] },
  ]));

  assert.deepEqual(state.summary, { valid: 2 });
  assert.equal(state.grandTotal, 8);
});

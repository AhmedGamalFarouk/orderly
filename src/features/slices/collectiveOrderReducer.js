// src/features/slices/collectiveOrdersSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const collectiveOrdersSlice = createSlice({
  name: "collectiveOrders",
  initialState: {
    orders: [],  // Each order = { id (userId), name, selectedItems: [{id, qty}], submittedAt }
    summary: {}, // { itemId: totalQuantity }
    grandTotal: 0
  },
  reducers: {
    setCollectiveOrders: (state, action) => {
      const orders = Array.isArray(action.payload) ? action.payload : [];
      state.orders = orders;
      state.grandTotal = 0;

      // Compute summary
      const summary = {};
      orders.forEach(order => {
        const selectedItems = Array.isArray(order?.selectedItems)
          ? order.selectedItems
          : [];
        selectedItems.forEach(item => {
          if (!item || item.id === undefined) return;
          if (!summary[item.id]) {
            summary[item.id] = 0;
          }
          const quantity = Number(item.qty) || 0;
          const price = Number(item.price) || 0;
          summary[item.id] += quantity;
          state.grandTotal += quantity * price;

        });
      });
      state.summary = summary;
    },
    clearCollectiveOrders: (state) => {
      state.orders = [];
      state.summary = {};
      state.grandTotal = 0;
    },
  },
});

export const { setCollectiveOrders, clearCollectiveOrders } = collectiveOrdersSlice.actions;
export default collectiveOrdersSlice.reducer;

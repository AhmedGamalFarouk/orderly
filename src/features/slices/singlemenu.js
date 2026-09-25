// src/features/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const singlemenu = createSlice({
  name: "singlemenu",
  initialState: { arr: [], total: 0, userId: -1 },
  reducers: {
    resetMenu: () => ({ arr: [], total: 0, userId: -1 }),
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.arr.find((item) => item.id === id);
      if (item) {
        const parsedQuantity = Number(quantity);
        const nextQuantity = Number.isFinite(parsedQuantity)
          ? Math.max(0, Math.floor(parsedQuantity))
          : 0;
        state.total += (nextQuantity - item.quantity) * item.price;
        item.quantity = nextQuantity;
      }
    },
    setMenu: (state, action) => {
      const { id, legacyId, name, description, price, imageUrl } = action.payload;
      if (!state.arr.some((item) => item.id === id)) {
        state.arr.push({ id, legacyId, name, description, price: Number(price) || 0, imageUrl, quantity: 0 });
      }
    },
    setUserId: (state, payload) => {
      state.userId = payload.payload;
    },
  },
});

export const { resetMenu, setMenu, setQuantity, setUserId } = singlemenu.actions;

export default singlemenu.reducer;

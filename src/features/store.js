// import { configureStore } from "@reduxjs/toolkit";
// import spaceReducer from "./slices/spaceReducer";
// import participantsReducer from "./slices/participantsReducer";
// import orderReducer from "./slices/orderSlice";
// import adminReducer from "./slices/adminReducer";
// import menuReducer from "./slices/menuSlice";
// import singlemenuReducer from "./slices/singlemenu";

// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/index.js"; // uses localStorage for web

// Your reducers
import spaceReducer from "./slices/spaceReducer.js";
import participantsReducer from "./slices/participantsReducer.js";
import orderReducer from "./slices/orderSlice.js";
import adminReducer from "./slices/adminReducer.js";
import menuReducer from "./slices/menuSlice.js";
import singlemenuReducer from "./slices/singlemenu.js";
import { collectiveOrdersSlice } from "./slices/collectiveOrderReducer.js";

// Combine all your slices
const rootReducer = combineReducers({
  space: spaceReducer,
  menu: menuReducer,
  participants: participantsReducer,
  order: orderReducer,
  admin: adminReducer,
  single: singlemenuReducer,
  collective: collectiveOrdersSlice.reducer
});

// Configure persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["admin", "order"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware for redux-persist
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./services/adminApi";
import { publicApi } from "./services/publicApi";
import { hostApi } from "./services/hostApi";
import { bookingApi } from "./services/bookingApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      publicApi.middleware,
      hostApi.middleware,
      bookingApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

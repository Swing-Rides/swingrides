import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./services/adminApi";
import { publicApi } from "./services/publicApi";
import { hostApi } from "./services/hostApi";
import { bookingApi } from "./services/bookingApi";
import { expensesApi } from "./services/expensesApi";
import { analyticsApi } from "./services/analyticsApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      publicApi.middleware,
      hostApi.middleware,
      bookingApi.middleware,
      expensesApi.middleware,
      analyticsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

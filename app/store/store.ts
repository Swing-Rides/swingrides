import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./services/adminApi";
import { publicApi } from "./services/publicApi";
import { hostApi } from "./services/hostApi";
import { bookingApi } from "./services/bookingApi";
import { expensesApi } from "./services/expensesApi";
import { analyticsApi } from "./services/analyticsApi";
import { reviewsApi } from "./services/reviewsApi";
import { settingsApi } from "./services/settingsApi";
import { reportApi } from "./services/reportApi";
import { dashboardApi } from "./services/dashboardApi";
import { notificationApi } from "./services/notificationApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      publicApi.middleware,
      hostApi.middleware,
      bookingApi.middleware,
      expensesApi.middleware,
      analyticsApi.middleware,
      reviewsApi.middleware,
      settingsApi.middleware,
      reportApi.middleware,
      dashboardApi.middleware,
      notificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

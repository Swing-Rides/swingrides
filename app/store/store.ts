import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
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
import { adminNotificationApi } from "./services/adminNotificationApi";
import { renterApi } from "./services/renterApi";

import publicReducer from "./reducers/public.reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

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
    [adminNotificationApi.reducerPath]: adminNotificationApi.reducer,
    [renterApi.reducerPath]: renterApi.reducer,
    publicReducer: publicReducer,
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
      adminNotificationApi.middleware,
      renterApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
  resetHostApiState,
  resetRenterApiState,
  resetAdminApiState,
  resetAllApiState,
} from "./resetState";

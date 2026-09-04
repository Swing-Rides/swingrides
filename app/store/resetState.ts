import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { adminApi } from "./services/adminApi";
import { adminNotificationApi } from "./services/adminNotificationApi";
import { analyticsApi } from "./services/analyticsApi";
import { bookingApi } from "./services/bookingApi";
import { dashboardApi } from "./services/dashboardApi";
import { expensesApi } from "./services/expensesApi";
import { hostApi } from "./services/hostApi";
import { notificationApi } from "./services/notificationApi";
import { publicApi } from "./services/publicApi";
import { renterApi } from "./services/renterApi";
import { reportApi } from "./services/reportApi";
import { reviewsApi } from "./services/reviewsApi";
import { settingsApi } from "./services/settingsApi";

type DispatchLike =
  | ThunkDispatch<unknown, unknown, Action>
  | ((action: Action) => unknown);

/**
 * Resets all cache entries, subscriptions, and state across host-scoped RTK Query API slices.
 */
export const resetHostApiState = (dispatch: DispatchLike) => {
  dispatch(hostApi.util.resetApiState());
  dispatch(bookingApi.util.resetApiState());
  dispatch(expensesApi.util.resetApiState());
  dispatch(analyticsApi.util.resetApiState());
  dispatch(reviewsApi.util.resetApiState());
  dispatch(settingsApi.util.resetApiState());
  dispatch(reportApi.util.resetApiState());
  dispatch(dashboardApi.util.resetApiState());
  dispatch(notificationApi.util.resetApiState());
};

/**
 * Resets all cache entries and state across renter-scoped RTK Query API slices.
 */
export const resetRenterApiState = (dispatch: DispatchLike) => {
  dispatch(renterApi.util.resetApiState());
  dispatch(reportApi.util.resetApiState());
  dispatch(reviewsApi.util.resetApiState());
};

/**
 * Resets all cache entries and state across super-admin-scoped RTK Query API slices.
 */
export const resetAdminApiState = (dispatch: DispatchLike) => {
  dispatch(adminApi.util.resetApiState());
  dispatch(adminNotificationApi.util.resetApiState());
};

/**
 * Resets all RTK Query slices in the application.
 */
export const resetAllApiState = (dispatch: DispatchLike) => {
  resetHostApiState(dispatch);
  resetRenterApiState(dispatch);
  resetAdminApiState(dispatch);
  dispatch(publicApi.util.resetApiState());
};

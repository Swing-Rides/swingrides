import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./services/adminApi";
import { publicApi } from "./services/publicApi";
import { hostApi } from "./services/hostApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [hostApi.reducerPath]: hostApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, publicApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

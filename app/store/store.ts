import { configureStore } from '@reduxjs/toolkit'
import { adminApi } from './services/adminApi'

export const store = configureStore({
        reducer: {
                [adminApi.reducerPath]: adminApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(adminApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

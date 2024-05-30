import { configureStore } from "@reduxjs/toolkit";
import { clientApi } from "../apiCall/client/clientAPi";
import chunkSlice from "./features/chunkSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [clientApi.reducerPath]: clientApi.reducer,
      chunkData: chunkSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(clientApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

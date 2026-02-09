"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import ToastProvider from "@/components/ui/ToastProvider";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ToastProvider />
      {children}
    </Provider>
  );
}
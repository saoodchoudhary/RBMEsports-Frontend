"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/store/authSlice";

function Boot() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  return null;
}

export default function ProtectedLayout({ children }) {
  return (
    <>
      <Boot />
      <Navbar />
      <main className="container py-8">{children}</main>
      <Footer />
    </>
  );
}
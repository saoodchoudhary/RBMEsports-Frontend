import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container py-8">{children}</main>
      <Footer />
    </>
  );
}
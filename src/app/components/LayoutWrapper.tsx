"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/page";
import Footer from "./footer/page";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.includes("login") || pathname.includes("register");

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function SurveysLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}

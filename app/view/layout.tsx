"use client";

import { Suspense } from "react";

export default function ViewSurveyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense>{children}</Suspense>;
}

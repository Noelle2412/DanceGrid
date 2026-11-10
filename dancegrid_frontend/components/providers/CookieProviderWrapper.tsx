"use client";
import React from "react";
import { CookiesProvider } from "react-cookie";

export default function CookieProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookiesProvider>{children}</CookiesProvider>;
}

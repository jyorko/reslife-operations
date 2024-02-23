import Provider from "@/app/dashboard/Provider";
import React, { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

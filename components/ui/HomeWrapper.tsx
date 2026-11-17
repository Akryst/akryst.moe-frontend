"use client";

import { useState } from "react";
import { SplashScreen } from "./SplashScreen";

export function HomeWrapper({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  return <>{children}{!entered && <SplashScreen onEnter={() => setEntered(true)} />}</>;
}

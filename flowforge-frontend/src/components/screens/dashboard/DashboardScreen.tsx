"use client";

import { useEffect, useState } from "react";
import MobileDashboard from "./MobileDashboard";
import DesktopDashboard from "./DesktopDashboard";

export default function DashboardScreen() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (isDesktop) {
    return <DesktopDashboard />;
  }

  return <MobileDashboard />;
}
"use client";

import { useEffect } from "react";

export default function AppStoreRedirect() {
  useEffect(() => {
    window.location.replace("https://apps.apple.com/app/kinlet/id6758401270");
  }, []);
  return null;
}

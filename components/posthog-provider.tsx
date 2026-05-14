"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const TRACKED_PATHS = new Set(["/", "/partners"]);

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !TRACKED_PATHS.has(pathname)) return;
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;

    const search = searchParams?.toString();
    const url = search ? `${window.origin}${pathname}?${search}` : `${window.origin}${pathname}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (posthog.__loaded) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "never",
      persistence: "memory",
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      enable_heatmaps: false,
      advanced_disable_decide: true,
    });
  }, []);

  return (
    <Suspense fallback={null}>
      <PostHogPageview />
    </Suspense>
  );
}

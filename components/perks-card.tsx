"use client";

import { useEffect, useRef, type PointerEvent } from "react";

const MAX_TILT = 14;
const PRESS_DEPTH = 18;
const REST_TILT_X = -8;
const REST_TILT_Y = -10;

export function PerksCard() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: REST_TILT_X, y: REST_TILT_Y, z: 0 });

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const applyTransform = () => {
    frameRef.current = null;
    const el = cardRef.current;
    if (!el) return;
    const { x, y, z } = targetRef.current;
    el.style.setProperty("--tilt-x", `${x}deg`);
    el.style.setProperty("--tilt-y", `${y}deg`);
    el.style.setProperty("--tilt-z", `${z}px`);
  };

  const scheduleFrame = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(applyTransform);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    targetRef.current = {
      x: -dy * MAX_TILT,
      y: dx * MAX_TILT,
      z: -PRESS_DEPTH,
    };
    scheduleFrame();
  };

  const handlePointerEnter = () => {
    const el = cardRef.current;
    if (!el) return;
    el.dataset.hovered = "true";
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    delete el.dataset.hovered;
    targetRef.current = { x: REST_TILT_X, y: REST_TILT_Y, z: 0 };
    scheduleFrame();
  };

  return (
    <div
      ref={stageRef}
      className="perks-card-stage"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={cardRef}
        className="perks-card"
        style={{
          ["--tilt-x" as string]: `${REST_TILT_X}deg`,
          ["--tilt-y" as string]: `${REST_TILT_Y}deg`,
          ["--tilt-z" as string]: "0px",
        }}
      >
        <div className="perks-card-shine" aria-hidden />
        <div className="perks-card-noise" aria-hidden />
        <div className="perks-card-content">
          <div className="perks-card-top">
            <div className="perks-card-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" aria-hidden />
              <span>Kinlet</span>
            </div>
            <span className="perks-card-tag">Perks</span>
          </div>

          <div className="perks-card-bottom">
            <div className="perks-card-row">
              <span className="perks-card-label">Member</span>
              <span className="perks-card-value">Your family</span>
            </div>
            <div className="perks-card-row perks-card-row-end">
              <span className="perks-card-label">Status</span>
              <span className="perks-card-value perks-card-value-accent">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

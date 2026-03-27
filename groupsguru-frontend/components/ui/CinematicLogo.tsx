"use client";

import React, { useEffect, useRef } from "react";

export function CinematicLogo({ width = 200, height = 200 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use devicePixelRatio for crisp high-DPI rendering
    const dpr = window.devicePixelRatio || 1;
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    const logicalWidth = width;
    const logicalHeight = height;
    
    // Scale all drawing operations by the dpr
    ctx.scale(dpr, dpr);

    const CX = logicalWidth / 2;
    const CY = logicalHeight / 2;
    // Adjust scaling so the 40x40 logo perfectly fits the requested container 
    // keeping 80% of space, so scale = (width * 0.8) / 40
    const LOGO_SCALE = (Math.min(logicalWidth, logicalHeight) * 0.8) / 40;

    const outerArc = new Path2D("M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8");
    const middleArc = new Path2D("M28 20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8");
    const innerArc = new Path2D("M24 20c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4");
    const centerDot = new Path2D("M21.5 20 A 1.5 1.5 0 1 1 18.5 20 A 1.5 1.5 0 1 1 21.5 20");
    const horizontalBar = new Path2D("M20 20 L32 20");

    const LOOP_MS = 4000;
    const RADAR_LOOP_MS = 2500;
    const FRICTION = 1.1;

    const NUM_PARTICLES = 80;
    const particles: any[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        spawnTime: (i / NUM_PARTICLES) * LOOP_MS,
        angle: Math.random() * Math.PI * 2,
        v0: 80 + Math.random() * 150,
        size: Math.random() * 2 + 0.5,
        wigglePhase: Math.random() * Math.PI * 2,
        isCore: Math.random() > 0.85,
      });
    }

    let animationFrameId: number;
    let startTime = Date.now();

    function easeOutQuart(x: number) { return 1 - Math.pow(1 - x, 4); }

    const COLOR_ORANGE = "#FF7A00";

    function render() {
      const now = Date.now();
      const elapsed = now - startTime;
      const tNorm = (elapsed % LOOP_MS) / LOOP_MS;
      const rNorm = (elapsed % RADAR_LOOP_MS) / RADAR_LOOP_MS;

      // Essential for blending: clear with NO background
      ctx!.clearRect(0, 0, logicalWidth, logicalHeight);

      // 1. GLOBAL BLENDING: Ultra-soft radial glow to blur edges into background
      ctx!.save();
      const globalGlow = ctx!.createRadialGradient(CX, CY, 0, CX, CY, Math.max(logicalWidth, logicalHeight) * 0.6);
      globalGlow.addColorStop(0, "rgba(217, 119, 6, 0.2)");
      globalGlow.addColorStop(0.5, "rgba(217, 119, 6, 0.05)");
      globalGlow.addColorStop(1, "rgba(217, 119, 6, 0)");
      ctx!.fillStyle = globalGlow;
      ctx!.globalCompositeOperation = "screen";
      ctx!.fillRect(0, 0, logicalWidth, logicalHeight);
      ctx!.restore();

      ctx!.save();
      ctx!.translate(CX, CY);
      const floatScale = 1.0 + Math.sin(tNorm * Math.PI * 2) * 0.02;
      ctx!.scale(floatScale, floatScale);
      ctx!.translate(-CX, -CY);

      ctx!.save();
      ctx!.translate(CX, CY);
      ctx!.scale(LOGO_SCALE, LOGO_SCALE);
      ctx!.translate(-20, -20);

      // 2. LIVING RADAR SWEEP
      ctx!.save();
      ctx!.translate(20, 20);
      ctx!.rotate(rNorm * Math.PI * 2);
      ctx!.translate(-20, -20);
      
      const sweepGrad = ctx!.createConicGradient(-Math.PI * 0.5, 20, 20);
      sweepGrad.addColorStop(0, "rgba(217, 119, 6, 0.8)");
      sweepGrad.addColorStop(0.2, "rgba(217, 119, 6, 0.2)");
      sweepGrad.addColorStop(0.4, "rgba(217, 119, 6, 0)");
      
      ctx!.beginPath();
      ctx!.moveTo(20, 20);
      ctx!.arc(20, 20, 30, -Math.PI * 0.5, Math.PI * 0.5); 
      ctx!.fillStyle = sweepGrad;
      ctx!.globalCompositeOperation = "screen";
      ctx!.fill();
      
      // Sweep Lead Line
      ctx!.beginPath();
      ctx!.moveTo(20, 20);
      ctx!.lineTo(20, -10);
      ctx!.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx!.lineWidth = 0.5;
      ctx!.stroke();
      ctx!.restore();

      // 3. ATMOSPHERIC PARTICLES
      ctx!.save();
      ctx!.globalCompositeOperation = "screen";
      particles.forEach((p) => {
        let ageMs = (elapsed - p.spawnTime) % LOOP_MS;
        if (ageMs < 0) ageMs += LOOP_MS;
        let ageSec = ageMs / 1000;
        let lifeNorm = ageMs / LOOP_MS;

        let distance = (p.v0 / FRICTION) * (1 - Math.exp(-FRICTION * ageSec));
        let wiggle = Math.sin(p.wigglePhase + ageSec * 6) * 0.5;
        let currentAngle = p.angle + wiggle * (1 - lifeNorm);

        let px = 20 + Math.cos(currentAngle) * distance;
        let py = 20 + Math.sin(currentAngle) * distance;

        let alpha = 1.0;
        if (lifeNorm < 0.1) alpha = lifeNorm / 0.1;
        else alpha = 1.0 - easeOutQuart((lifeNorm - 0.1) / 0.9);

        ctx!.beginPath();
        ctx!.arc(px, py, (p.size * (1 - lifeNorm * 0.3)) / LOGO_SCALE, 0, Math.PI * 2);
        ctx!.fillStyle = p.isCore
          ? `rgba(255, 255, 255, ${alpha * 0.7})`
          : `rgba(217, 119, 6, ${alpha * 0.4})`;
        ctx!.fill();
      });
      ctx!.restore();

      // 4. CORE LOGO
      ctx!.save();
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";

      const baseGrad = ctx!.createLinearGradient(10, 10, 30, 30);
      baseGrad.addColorStop(0, "#D97706");
      baseGrad.addColorStop(1, "#F59E0B");

      const renderParts = () => {
        ctx!.lineWidth = 2.5; ctx!.stroke(outerArc);
        ctx!.lineWidth = 2.0; ctx!.stroke(middleArc);
        ctx!.lineWidth = 1.5; ctx!.stroke(innerArc);
        ctx!.lineWidth = 2.0; ctx!.stroke(horizontalBar);
        ctx!.fill(centerDot);
      };

      // Intense Core Glow
      ctx!.shadowBlur = 15;
      ctx!.shadowColor = "rgba(217, 119, 6, 0.7)";
      ctx!.strokeStyle = baseGrad;
      ctx!.fillStyle = baseGrad;
      renderParts();

      // Sharp Core
      ctx!.shadowBlur = 0;
      renderParts();

      // Highlight Pulse
      ctx!.globalCompositeOperation = "screen";
      ctx!.strokeStyle = `rgba(255, 255, 255, ${0.1 + 0.1 * Math.sin(tNorm * Math.PI * 2)})`;
      ctx!.lineWidth = 0.4;
      renderParts();

      ctx!.restore();
      ctx!.restore();
      ctx!.restore();

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height]);

  return (
    <div style={{ width, height, position: "relative" }} className="flex justify-center items-center pointer-events-none overflow-visible">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
      />
    </div>
  );
}

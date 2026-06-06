import * as React from "react";
import { useEffect, useRef } from "react";

export default function Visualizer2D({ isPlaying, bpm = 120, accentColor = "#ff4e98" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let phase = 0;
    
    // Manage particles
    const particles = [];
    const numParticles = 24;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 300,
        y: Math.random() * 150,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Render loop
    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Dark background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Phase update rate depends on BPM and play state
      const speedFactor = isPlaying ? (bpm / 120) * 0.05 : 0.008;
      phase += speedFactor;

      // Draw multiple responsive sine waves
      const drawWave = (offsetMultiplier, ampScale, color, lineWidth, speedScale) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowBlur = isPlaying ? 10 : 0;
        ctx.shadowColor = accentColor;
        
        const baseAmplitude = isPlaying ? height * 0.22 : height * 0.06;
        const wavePhase = phase * speedScale;

        for (let x = 0; x < width; x++) {
          const normalX = x / width;
          // Apply a bell curve/envelope to the wave so it fades at the edges elegantly
          const envelope = Math.sin(normalX * Math.PI);
          
          let y = height / 2;
          y += Math.sin(normalX * Math.PI * 4.2 + wavePhase + offsetMultiplier) * baseAmplitude * envelope;
          y += Math.cos(normalX * Math.PI * 2.5 - wavePhase * 1.4) * (baseAmplitude * 0.3) * envelope;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      };

      // Draw 3 layers of waves for 2D parallax flow
      drawWave(0, 1, "rgba(255, 78, 152, 0.15)", 1.5, 0.8);
      drawWave(Math.PI * 0.5, 1.2, `${accentColor}a0`, 2, 1.2);
      drawWave(Math.PI, 0.6, "rgba(56, 189, 248, 0.6)", 1, 1.6);

      // Draw particles
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Particle propagation
        if (isPlaying) {
          p.x += p.speedX * 2.5;
          p.y += p.speedY * 2.5;
        } else {
          p.x += p.speedX * 0.4;
          p.y += p.speedY * 0.4;
        }

        // Bound loops
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
          p.y = height;
        }
      });

      // Display dynamic 2D analyzer bars at the bottom
      const numBars = 32;
      const barWidth = width / numBars;
      ctx.fillStyle = "rgba(255, 78, 152, 0.08)";
      for (let i = 0; i < numBars; i++) {
        const factor = isPlaying ? Math.abs(Math.sin(phase + i * 0.5)) : Math.abs(Math.sin(i * 0.2)) * 0.2;
        const barHeight = factor * (height * 0.35);
        ctx.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPlaying, bpm, accentColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full rounded bg-[#09090b] pointer-events-none"
    />
  );
}

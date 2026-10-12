import React, { useEffect, useRef } from 'react';
import { soundManager } from '../../games/common/SoundSynthesizer';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

interface DolphinCompanionProps {
  enabled?: boolean;
}

export const DolphinCompanion: React.FC<DolphinCompanionProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dolphin State & Kinematics
    let posX = 150;
    let posY = 150;
    let angle = 0;
    let targetAngle = 0;
    let speed = 140; // px/s
    let tailWave = 0;
    let spinAngle = 0;
    let isSpinning = false;
    let spinProgress = 0;

    // Mouse tracking for playful interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Waypoints circling screen perimeter
    const getWaypoints = () => [
      { x: 120, y: 120 },
      { x: width - 120, y: 140 },
      { x: width - 140, y: height - 140 },
      { x: 140, y: height - 120 },
    ];

    let waypoints = getWaypoints();
    let currentWaypointIdx = 0;

    // Bubbles
    const bubbles: Bubble[] = [];

    const spawnBubble = (x: number, y: number, color = 'rgba(56, 189, 248, 0.7)') => {
      bubbles.push({
        x,
        y,
        radius: 2 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 15,
        vy: -20 - Math.random() * 30,
        alpha: 0.9,
        color,
      });
    };

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      tailWave += dt * 8;
      waypoints = getWaypoints();

      // Navigation AI
      let targetX = waypoints[currentWaypointIdx].x;
      let targetY = waypoints[currentWaypointIdx].y;

      // Check distance to mouse: if mouse is near, playfully curve towards it
      const distToMouse = Math.hypot(mouseX - posX, mouseY - posY);
      if (distToMouse < 220 && distToMouse > 80) {
        targetX = mouseX;
        targetY = mouseY;
      }

      const dx = targetX - posX;
      const dy = targetY - posY;
      const dist = Math.hypot(dx, dy);

      if (dist < 100 && targetX === waypoints[currentWaypointIdx].x) {
        currentWaypointIdx = (currentWaypointIdx + 1) % waypoints.length;
        // 35% chance to do a celebratory barrel roll jump
        if (Math.random() < 0.35 && !isSpinning) {
          isSpinning = true;
          spinProgress = 0;
          soundManager.playPop();
          for (let i = 0; i < 8; i++) {
            spawnBubble(posX, posY, '#FEE75C');
          }
        }
      }

      targetAngle = Math.atan2(dy, dx);
      // Smooth angle interpolation
      let angleDiff = targetAngle - angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      angle += angleDiff * 3.5 * dt;

      // Move forward
      posX += Math.cos(angle) * speed * dt;
      posY += Math.sin(angle) * speed * dt;

      // Handle spinning trick
      if (isSpinning) {
        spinProgress += dt * 4;
        spinAngle = spinProgress * Math.PI * 2;
        if (spinProgress >= 1) {
          isSpinning = false;
          spinAngle = 0;
        }
      }

      // Emit water trail bubbles from dolphin tail / blowhole
      if (Math.random() < 0.3) {
        const tailX = posX - Math.cos(angle) * 35;
        const tailY = posY - Math.sin(angle) * 35;
        spawnBubble(tailX, tailY);
      }

      // Update bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.alpha -= 0.6 * dt;
        if (b.alpha <= 0) {
          bubbles.splice(i, 1);
        }
      }

      // Render
      ctx.clearRect(0, 0, width, height);

      // 1. Render bubbles
      for (const b of bubbles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Dolphin
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(angle + spinAngle);

      // Dolphin Outer Neon Glow
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 16;

      // Dolphin Body (Streamlined cyan & ocean blue gradient)
      const grad = ctx.createLinearGradient(-40, 0, 40, 0);
      grad.addColorStop(0, '#0284C7'); // Ocean blue tail
      grad.addColorStop(0.5, '#38BDF8'); // Sky cyan body
      grad.addColorStop(1, '#E0F2FE'); // Pale snout

      ctx.fillStyle = grad;

      // Main Torso
      ctx.beginPath();
      ctx.moveTo(36, 0); // Snout
      // Top curve
      ctx.bezierCurveTo(24, -14, -5, -16, -30, -4);
      // Tail stock with wag
      const tailWagY = Math.sin(tailWave) * 6;
      ctx.quadraticCurveTo(-42, tailWagY - 2, -50, tailWagY);
      // Tail fin (Fluke)
      ctx.lineTo(-58, tailWagY - 14);
      ctx.lineTo(-50, tailWagY);
      ctx.lineTo(-58, tailWagY + 14);
      ctx.lineTo(-44, tailWagY);
      // Belly bottom curve
      ctx.quadraticCurveTo(-20, 14, 15, 8);
      ctx.bezierCurveTo(25, 6, 32, 2, 36, 0);
      ctx.closePath();
      ctx.fill();

      // Dorsal Fin (Vây lưng)
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.moveTo(-5, -13);
      ctx.quadraticCurveTo(-2, -26, -14, -24);
      ctx.quadraticCurveTo(-10, -13, -15, -11);
      ctx.closePath();
      ctx.fill();

      // Pectoral Fin (Vây bơi hông)
      ctx.fillStyle = '#0369A1';
      ctx.beginPath();
      ctx.moveTo(10, 4);
      ctx.quadraticCurveTo(8, 18, 0, 16);
      ctx.quadraticCurveTo(4, 8, 8, 4);
      ctx.closePath();
      ctx.fill();

      // Dolphin Friendly Eye
      ctx.fillStyle = '#0B0F19';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(22, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      // Eye highlight spark
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(23, -5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Friendly smile curve
      ctx.strokeStyle = '#0369A1';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(26, 0, 4, 0.2, Math.PI * 0.6);
      ctx.stroke();

      // Little Vietnam Star companion charm on Dolphin's fin
      ctx.save();
      ctx.translate(5, -16);
      ctx.scale(0.5, 0.5);
      ctx.fillStyle = '#FEE75C';
      ctx.shadowColor = '#FEE75C';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      // 5-point star
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const innerA = outerA + (2 * Math.PI) / 10;
        const rOuter = 9;
        const rInner = 4;
        if (i === 0) ctx.moveTo(Math.cos(outerA) * rOuter, Math.sin(outerA) * rOuter);
        else ctx.lineTo(Math.cos(outerA) * rOuter, Math.sin(outerA) * rOuter);
        ctx.lineTo(Math.cos(innerA) * rInner, Math.sin(innerA) * rInner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Interactive Click on Canvas: Pet the dolphin!
    const handleClick = (e: MouseEvent) => {
      const clickDist = Math.hypot(e.clientX - posX, e.clientY - posY);
      if (clickDist < 70) {
        soundManager.playMagicSpell();
        isSpinning = true;
        spinProgress = 0;
        for (let i = 0; i < 15; i++) {
          spawnBubble(posX, posY, i % 2 === 0 ? '#FEE75C' : '#38BDF8');
        }
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 w-full h-full"
    />
  );
};

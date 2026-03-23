"use client";

import { useEffect, useRef } from "react";

// All 7 classic tetrominos with their canonical colors
const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: "#00f0f0" },           // I – cyan
  { shape: [[1, 1], [1, 1]], color: "#f0f000" },          // O – yellow
  { shape: [[0, 1, 0], [1, 1, 1]], color: "#a000f0" },   // T – purple
  { shape: [[0, 1, 1], [1, 1, 0]], color: "#00f000" },   // S – green
  { shape: [[1, 1, 0], [0, 1, 1]], color: "#f00000" },   // Z – red
  { shape: [[1, 0, 0], [1, 1, 1]], color: "#0000f0" },   // J – blue
  { shape: [[0, 0, 1], [1, 1, 1]], color: "#f0a000" },   // L – orange
] as const;

const CELL_SIZE = 22;
const GAP = 1;
const PIECE_COUNT = 20;

type Shape = number[][];

interface FallingPiece {
  shape: Shape;
  color: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

function rotateCW(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: Shape = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function randomPiece(canvasWidth: number, startY?: number): FallingPiece {
  const template = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  let shape: Shape = template.shape.map((row) => [...row]);

  const rotations = Math.floor(Math.random() * 4);
  for (let i = 0; i < rotations; i++) shape = rotateCW(shape);

  const pieceWidth = shape[0].length * CELL_SIZE;
  const x = Math.random() * Math.max(canvasWidth - pieceWidth, 0);
  const pieceHeight = shape.length * CELL_SIZE;
  const y = startY !== undefined ? startY : -(pieceHeight + Math.random() * 800);

  return {
    shape,
    color: template.color,
    x,
    y,
    speed: 0.4 + Math.random() * 1.4,
    opacity: 0.25 + Math.random() * 0.35,
  };
}

function drawPiece(ctx: CanvasRenderingContext2D, piece: FallingPiece) {
  ctx.globalAlpha = piece.opacity;
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const px = piece.x + c * CELL_SIZE;
      const py = piece.y + r * CELL_SIZE;
      const inner = CELL_SIZE - GAP * 2;

      // Cell fill
      ctx.fillStyle = piece.color;
      ctx.fillRect(px + GAP, py + GAP, inner, inner);

      // Top highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(px + GAP, py + GAP, inner, 3);

      // Left highlight
      ctx.fillRect(px + GAP, py + GAP, 3, inner);

      // Bottom shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(px + GAP, py + GAP + inner - 3, inner, 3);
    }
  }
  ctx.globalAlpha = 1;
}

export function TetrisBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spread initial pieces across the full canvas height so the start doesn't look empty
    const pieces: FallingPiece[] = Array.from({ length: PIECE_COUNT }, () =>
      randomPiece(canvas.width, -Math.random() * canvas.height)
    );

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const piece of pieces) {
        piece.y += piece.speed;

        const pieceHeight = piece.shape.length * CELL_SIZE;
        if (piece.y > canvas.height + pieceHeight) {
          Object.assign(piece, randomPiece(canvas.width));
        }

        drawPiece(ctx, piece);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

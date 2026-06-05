"use client";

import { useState, useRef } from "react";

const slides = [
  {
    id: 1,
    title: "Slide Pertama",
    description: "Ini adalah konten slide pertama",
    bg: "#6366f1",
  },
  {
    id: 2,
    title: "Slide Kedua",
    description: "Ini adalah konten slide kedua",
    bg: "#8b5cf6",
  },
  {
    id: 3,
    title: "Slide Ketiga",
    description: "Ini adalah konten slide ketiga",
    bg: "#ec4899",
  },
  {
    id: 4,
    title: "Slide Keempat",
    description: "Ini adalah konten slide keempat",
    bg: "#f59e0b",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, slides.length - 1));

  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) next(); // swipe kiri → next
    if (diff < -50) prev(); // swipe kanan → prev
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      {/* Slide */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          background: slides[current].bg,
          borderRadius: "12px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          transition: "background 0.3s ease",
          position: "relative",
        }}
      >
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}
        >
          {slides[current].title}
        </h2>
        <p style={{ fontSize: "16px", opacity: 0.9 }}>
          {slides[current].description}
        </p>

        {/* Tombol Prev — disembunyikan di slide pertama */}
        <button
          onClick={prev}
          disabled={isFirst}
          style={{
            position: "absolute",
            left: "16px",
            background: isFirst
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: isFirst ? "not-allowed" : "pointer",
            fontSize: "18px",
            color: isFirst ? "rgba(255,255,255,0.3)" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          ‹
        </button>

        {/* Tombol Next — disembunyikan di slide terakhir */}
        <button
          onClick={next}
          disabled={isLast}
          style={{
            position: "absolute",
            right: "16px",
            background: isLast
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: isLast ? "not-allowed" : "pointer",
            fontSize: "18px",
            color: isLast ? "rgba(255,255,255,0.3)" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "999px",
              background: i === current ? "#6366f1" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <p
        style={{
          textAlign: "center",
          marginTop: "8px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        {current + 1} / {slides.length}
      </p>
    </div>
  );
}

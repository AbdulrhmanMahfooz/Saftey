"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: "#475569", marginBottom: 24 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

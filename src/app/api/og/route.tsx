import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/seo/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? `${siteConfig.name} — ${siteConfig.tagline}`).slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") ?? siteConfig.name).slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 70%, #FAF6F3 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#14141A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderBottom: "14px solid #FF5A1F",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#14141A",
              letterSpacing: -0.5,
            }}
          >
            {siteConfig.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#FF5A1F",
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 600,
              color: "#14141A",
              lineHeight: 1.15,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {title}
          </span>
        </div>
        <span style={{ fontSize: 22, color: "#6B6B66", letterSpacing: -0.2 }}>
          {new URL(siteConfig.url).host}
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

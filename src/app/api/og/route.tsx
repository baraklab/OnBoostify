import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/lib/seo/config";

export async function GET(request: NextRequest) {
  const logoBytes = await readFile(path.join(process.cwd(), "src/app/icon.png"));
  const logoMark = `data:image/png;base64,${logoBytes.toString("base64")}`;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoMark} alt="" width={44} height={44} />
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

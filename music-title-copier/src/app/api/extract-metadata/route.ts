import { NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the HTML content
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const root = parse(html);

    // Extract og:video:tag meta tags
    const videoTags = root.querySelectorAll('meta[property="og:video:tag"]');
    const tagValues = videoTags
      .map((tag) => tag.getAttribute("content"))
      .filter(Boolean) as string[];

    let title = "";

    if (tagValues.length > 0) {
      // Join all tag values with hyphens
      title = tagValues.join(" - ");
    } else {
      // Fallback to original title extraction if no og:video:tag found
      const ogTitle = root
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content");
      const twitterTitle = root
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content");
      const pageTitle = root.querySelector("title")?.text;

      title = ogTitle || twitterTitle || pageTitle || "";

      // Clean up title (remove common suffixes)
      title = title
        .replace(/\s*-\s*YouTube\s*Music?$/i, "")
        .replace(/\s*-\s*YouTube$/i, "")
        .replace(/\s*\|\s*Spotify$/i, "")
        .replace(/\s*on Apple Music$/i, "")
        .trim();
    }

    return NextResponse.json({
      title: title || "No title found",
      url,
    });
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return NextResponse.json(
      { error: "Failed to extract metadata" },
      { status: 500 }
    );
  }
}

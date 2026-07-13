import { getPosts } from "@/app/lib/blog-db";

// /llms.txt — guidance for AI / LLM crawlers (ChatGPT Search, Perplexity, Gemini,
// Claude). Follows the https://llmstxt.org convention: brand, summary, and links.
export const revalidate = 300;

const SITE_URL = "https://brightsfindings.com";
const SITE_NAME = "Brights Findings";
const TAGLINE = "In-depth, first-principles research & analysis";
const DESCRIPTION =
  "Brights Findings publishes in-depth, first-principles research and analysis — deep dives, data science, and clear explainers.";

export async function GET() {
  let posts: { slug: string; title: string; description: string }[] = [];
  try {
    posts = (await getPosts()).filter((p) => (p.title ?? "").trim());
  } catch {
    posts = [];
  }
  const list =
    posts
      .map(
        (p) =>
          `- [${p.title}](${SITE_URL}/${p.slug})${p.description ? `: ${p.description.slice(0, 160)}` : ""}`,
      )
      .join("\n") || "- See the sitemap for the full list of pages.";

  const body = `# ${SITE_NAME}

> ${TAGLINE}

${DESCRIPTION}

## Articles
${list}

## Key pages
- [Home](${SITE_URL}/)
- [Sitemap (all URLs)](${SITE_URL}/sitemap.xml)
- [Robots](${SITE_URL}/robots.txt)

## Notes for AI engines
${SITE_NAME} content may be cited in AI answers with attribution and a link back to the source page on ${SITE_URL}.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

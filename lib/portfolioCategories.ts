export const portfolioCategories = [
  { id: "avatars", label: "Avatar", tags: ["avatar", "avatars"] },
  { id: "overlays", label: "Overlay", tags: ["overlay", "overlays", "obs"] },
  { id: "web", label: "Website", tags: ["web", "website"] },
  { id: "code", label: "Code / GitHub", tags: ["code", "github"] },
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number]["id"];

export function portfolioCategory(tags: string[]): PortfolioCategory {
  const normalized = tags.map((tag) => tag.trim().toLowerCase());
  return portfolioCategories.slice(1).find(({ tags }) => tags.some((tag) => normalized.includes(tag)))?.id ?? "avatars";
}

export function portfolioTags(category: PortfolioCategory, tags: string[]) {
  const section = portfolioCategories.find(({ id }) => id === category);
  const categoryTags = new Set<string>(portfolioCategories.flatMap(({ tags }) => [...tags]));
  return [...(section ? [section.tags[0]] : []), ...tags.filter((tag) => !categoryTags.has(tag.trim().toLowerCase()))];
}

export function portfolioWebsiteUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value.trim());
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch {
    return;
  }
}

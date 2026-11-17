export interface BlogImageOptions {
  width: number | "full";
  align: "left" | "center" | "right";
  caption: string;
}

export interface EditableBlogImage extends BlogImageOptions {
  src: string;
  alt: string;
  start: number;
  end: number;
}

export function readBlogImageOptions(title?: string | null): BlogImageOptions {
  const fallback: BlogImageOptions = { width: "full", align: "center", caption: "" };
  if (!title?.startsWith("blog-image:")) return fallback;
  try {
    const value = JSON.parse(decodeURIComponent(title.slice(11)));
    if (!value || typeof value !== "object") return fallback;
    return {
      width: value.width === "full" ? "full" : Number.isInteger(value.width) && value.width >= 80 && value.width <= 1920 ? value.width : "full",
      align: ["left", "center", "right"].includes(value.align) ? value.align : "center",
      caption: typeof value.caption === "string" ? value.caption.slice(0, 500) : "",
    };
  } catch { return fallback; }
}

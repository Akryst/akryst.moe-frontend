export function hosNotePreview(notes: string) {
  const imagePattern = /!\[(?:\\.|[^\]\\])*\]\(\s*(?:<[^>]*>|(?:\\.|[^\s)\\])+)(?:\s+"[^"]*")?\s*\)/g;
  const images = notes.match(imagePattern) ?? [];
  const withoutImages = notes.replace(imagePattern, "");
  const paragraphs = withoutImages.replace(/```[\s\S]*?(?:```|$)/g, "").split(/\n\s*\n/)
    .map(block => block.replace(/^#{1,6}\s+.*$/gm, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_\x60~]/g, "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const first = paragraphs[0] ?? "";
  const text = first.length > 240 ? first.slice(0, 240).replace(/\s+\S*$/, "") + "…" : first;
  return { text, image: images[0] ?? "", collapsed: paragraphs.length > 1 || first.length > 240 || images.length > 1 || notes.includes("```") };
}

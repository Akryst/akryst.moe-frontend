import type { Metadata } from "next";
import { HosClient } from "./HosClient";

export const metadata: Metadata = {
  title: "Hall of Shame | akryst",
  description: "A public record of sites that copied akryst.moe.",
  robots: { index: false },
};

export default function HosPage() {
  return <HosClient />;
}

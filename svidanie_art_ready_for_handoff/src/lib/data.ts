export type { Material } from "@/lib/types";
import type { Material } from "@/lib/types";

export const materials: {
  id: Material;
  name: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "metal",
    name: "Portrait on Metal",
    tagline: "Ultra-modern & durable",
    description:
      "A sleek, luminous finish infused directly onto aluminum for a gallery-grade piece that resists fading, moisture, and time itself.",
  },
  {
    id: "string",
    name: "String / Thread Art",
    tagline: "Handcrafted texture",
    description:
      "Thousands of individually placed premium threads woven around brass pins, forming a portrait with striking depth and tactility.",
  },
  {
    id: "canvas",
    name: "Canvas Portrait",
    tagline: "Museum-quality finish",
    description:
      "Classic oil-inspired paint on premium fabric canvas, hand-finished for a timeless heirloom that feels like true fine art.",
  },
];

export const occasions = ["Weddings", "Birthdays", "Family Tributes", "Anniversaries"];
export const themes = ["Royal", "Classic", "Modern", "Abstract"];

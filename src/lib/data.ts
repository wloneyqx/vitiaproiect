export type { Material } from "@/lib/types";
import type { Material } from "@/lib/types";

export const materials: {
  id: Material;
  name: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "canvas",
    name: "Portrait on Canvas",
    tagline: "Fine-art texture",
    description:
      "A warm, tactile portrait on premium canvas, prepared for framed interiors and emotional gifts.",
  },
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
];

export const occasions = ["Weddings", "Birthdays", "Family Tributes", "Anniversaries"];
export const themes = ["Royal", "Classic", "Modern", "Abstract"];

export const canvasSizes = ["20x30", "30x40", "40x50", "40x60", "50x60", "50x70", "60x80", "80x100", "80x120"];

export const metalSizes = [
  { label: "20x30", price: 349 },
  { label: "30x40", price: 449 },
  { label: "40x50", price: 549 },
  { label: "40x60", price: 649 },
  { label: "50x60", price: 679 },
  { label: "50x70", price: 729 },
  { label: "60x80", price: 879 },
  { label: "60x100", price: 1079 },
];

import tshirt from "@/assets/p-tshirt.jpg";
import hoodie from "@/assets/p-hoodie.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import loafers from "@/assets/p-loafers.jpg";
import moringaPowder from "@/assets/p-moringa-powder.jpg";
import moringaCaps from "@/assets/p-moringa-caps.jpg";
import dress from "@/assets/p-dress.jpg";
import watch from "@/assets/p-watch.jpg";
import placeholder from "@/assets/p-tshirt.jpg";

export const slugImageMap: Record<string, string> = {
  "essential-black-tee": tshirt,
  "oversized-beige-hoodie": hoodie,
  "minimal-white-sneakers": sneakers,
  "classic-leather-loafers": loafers,
  "organic-moringa-powder": moringaPowder,
  "moringa-capsules-90": moringaCaps,
  "elegant-cream-midi-dress": dress,
  "gold-classic-watch": watch,
};

export const resolveImage = (slug: string, dbImage?: string | null) => {
  if (slugImageMap[slug]) return slugImageMap[slug];
  if (dbImage && (dbImage.startsWith("http") || dbImage.startsWith("data:"))) return dbImage;
  return placeholder;
};

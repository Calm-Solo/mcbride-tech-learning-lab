/**
 * Merch catalog for the Store page.
 * Images are static imports from images/ so next/image knows their intrinsic size.
 * Products are hardcoded until the Printify sync and Stripe checkout are set up.
 */
import type { StaticImageData } from "next/image";
import frontLightPink from "@/images/front-light-pink.png";
import backLightPink from "@/images/back-light-pink.png";
import frontLime from "@/images/front-lime.png";
import backLime from "@/images/back-lime.png";
import frontBlack from "@/images/front-black.png";
import backBlack from "@/images/black-back.png";

export type MerchItem = {
  id: string;
  name: string;
  front: StaticImageData;
  back: StaticImageData;
};

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: "tee-light-pink",
    name: "Light Pink Tee",
    front: frontLightPink,
    back: backLightPink,
  },
  {
    id: "tee-lime",
    name: "Lime Tee",
    front: frontLime,
    back: backLime,
  },
  {
    id: "tee-black",
    name: "Black Tee",
    front: frontBlack,
    back: backBlack,
  },
];

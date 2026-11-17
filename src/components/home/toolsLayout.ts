/**
 * Where each tool icon and org logo floats, from Elijah's Figma mockup.
 * Positions are percentages of the cluster box, so the arrangement scales
 * with the screen. Add an entry when you add a tool or org in content/home.ts;
 * anything without one gets a free spot below the cluster.
 *
 * left / top: position of the item's top-left corner, in % of the box.
 * width:      logos only, % of the box width (icons are all one size).
 * tilt:       rotation in degrees.
 * depth:      0 to 1. Lower reads as deeper in the water (more faded).
 */

export type Spot = {
  left: number;
  top: number;
  width?: number;
  tilt: number;
  depth?: number;
};

/** Tool icon size, as % of the tools box width. */
export const TOOL_SIZE = 25;
/** Tools box: width / height. */
export const TOOLS_ASPECT = 10 / 9;

export const toolSpots: Record<string, Spot> = {
  Figma: { left: 14, top: 0, tilt: -10 },
  Framer: { left: 55, top: 0, tilt: 12 },
  Notion: { left: 0, top: 32, tilt: -8 },
  Affinity: { left: 36, top: 31, tilt: 8 },
  'Claude Code': { left: 75, top: 29, tilt: 14 },
  Procreate: { left: 21, top: 70, tilt: -15, depth: 0.8 },
  Illustrator: { left: 61, top: 65, tilt: -12 },
};

/** Logos box: width / height. */
export const LOGOS_ASPECT = 1.68;

export const orgSpots: Record<string, Spot> = {
  'UCI ICS': { left: 0, top: 8, width: 45, tilt: 5 },
  'Hack at UCI': { left: 53, top: 0, width: 45, tilt: -10 },
  VenusHacks: { left: 1, top: 43, width: 44, tilt: -3 },
  'FUSION ICS Project': { left: 65, top: 38, width: 33, tilt: -8 },
  PreQualy: { left: 11, top: 70, width: 33, tilt: 8 },
  'NMM Navigator': { left: 56, top: 77, width: 42, tilt: -7 },
};

/** A spot for an item with no entry above: a loose row under the cluster. */
export function fallbackSpot(index: number, width?: number): Spot {
  const tilts = [-6, 5, -3, 7];
  return {
    left: (index % 3) * 34,
    top: 100 + Math.floor(index / 3) * 30,
    width,
    tilt: tilts[index % tilts.length],
  };
}

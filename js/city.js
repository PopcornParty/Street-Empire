import { BUSINESSES, DISTRICTS, PROPERTIES } from "./data.js";
import { getState } from "./state.js";

export const DISTRICT_LAYOUT = {
  downtown: { x: 40, y: 280, w: 250, h: 200 },
  suburbs: { x: 320, y: 300, w: 230, h: 180 },
  industrial: { x: 580, y: 290, w: 260, h: 200 },
  harbour: { x: 40, y: 500, w: 280, h: 170 },
  financial: { x: 340, y: 80, w: 240, h: 180 },
  entertainment: { x: 40, y: 80, w: 260, h: 170 },
  hills: { x: 620, y: 60, w: 250, h: 180 },
  airport: { x: 600, y: 520, w: 270, h: 160 },
  tech: { x: 360, y: 500, w: 220, h: 170 },
  megacity: { x: 330, y: 250, w: 220, h: 140 }
};

export function holdingsInDistrict(id, s = getState()) {
  const biz = BUSINESSES.filter((b) => b.district === id && s.businesses[b.id]);
  const props = PROPERTIES.filter((p) => p.district === id && s.properties[p.id]);
  return { biz, props, count: biz.length + props.length };
}

export function districtDevClass(id, s = getState()) {
  const n = holdingsInDistrict(id, s).count;
  if (n >= 6) return "dev-3";
  if (n >= 3) return "dev-2";
  if (n >= 1) return "dev-1";
  return "";
}

export function plotsForDistrict(id) {
  return BUSINESSES.filter((b) => b.district === id);
}

export function districtById(id) {
  return DISTRICTS.find((d) => d.id === id);
}

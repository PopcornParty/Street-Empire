/**
 * Demo leaderboard service.
 * Replace LeaderboardService.impl with a real HTTP client later.
 * v1.0 is local-only and never pretends to be live multiplayer.
 */
import { DEMO_LEADERBOARD } from "./data.js";
import { getState } from "./state.js";
import { netWorth, empireLevel } from "./economy.js";

export const LeaderboardService = {
  mode: "demo",
  async fetchBoard() {
    const s = getState();
    const you = {
      name: s.username || "You",
      worth: netWorth(s),
      level: empireLevel(s.xp).level,
      you: true
    };
    const rows = [...DEMO_LEADERBOARD.map((r) => ({ ...r, you: false })), you]
      .sort((a, b) => b.worth - a.worth)
      .map((r, i) => ({ ...r, rank: i + 1 }));
    return { mode: "demo", rows };
  }
};

export function socialProfile(s = getState()) {
  return {
    playerId: s.playerId,
    username: s.username,
    netWorth: netWorth(s),
    empireLevel: empireLevel(s.xp).level,
    businesses: Object.keys(s.businesses),
    achievements: s.achievements,
    friends: [],
    leaderboardPosition: null
  };
}

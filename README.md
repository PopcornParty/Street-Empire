# STREET EMPIRE

A mobile-first business empire / idle tycoon game. Start with $10,000, buy your first shop, collect profits, hire staff, unlock districts, and grow a city-wide empire.

## Play

Open `index.html` in any modern browser (Chrome, Safari, Firefox, Edge).

- Phones: bottom navigation, large touch targets
- Tablets / desktop: sidebar navigation
- Progress saves automatically in the browser (`localStorage`)

GitHub Pages: enable Pages on the `main` branch (root). Then visit  
`https://popcornparty.github.io/Street-Empire/`

## Gameplay

1. Complete the short tutorial
2. Buy a business on the City map or in the Shop
3. Profits accumulate — tap **Collect**
4. Upgrade buildings, equipment, staff, ads, and tech
5. Hire employees and assign them for income bonuses
6. Buy properties for rent and extra slots
7. Unlock new districts with reputation and empire level
8. Complete missions, contracts, achievements, and daily rewards
9. Come back later — businesses keep earning while you are away (capped)

## Systems (v1.0)

- 32 businesses across 6 tiers
- 10 city districts with visual growth
- 22 properties, 16 vehicles, 9 employee roles
- 50+ missions, 40+ achievements, 20+ contracts, 20+ city events
- Offline earnings, daily rewards, HQ upgrades, garage
- Local save / export / import / reset
- Demo leaderboard architecture (local only — not online multiplayer)

No real-money purchases. No loot boxes. Everything unlocks by playing.

## Project layout

```
index.html
README.md
css/          main, mobile, desktop, map, menus, animations
js/           engine, data catalogs, systems, UI
assets/
```

## Future backend

`js/leaderboard.js` and player profile fields (`playerId`, friends, rank) are structured so a real API can replace the local demo service later. v1.0 does **not** pretend to be online multiplayer.

## Credits

Original STREET EMPIRE project. Dark urban theme, original names and UI. Not affiliated with any other tycoon title.

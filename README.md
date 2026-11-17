# Aether Rivals

A lightweight, original first-person hero-shooter prototype. It includes a
first-person arena, four selectable heroes with distinct portraits and weapons,
three selectable arenas with different themes and cover layouts, wave-based
combat, procedural sound effects, a rotating capture objective with rewards,
hero-specific tactical abilities, cosmetic suit finishes, settings, friend
presence, and a live leaderboard. The game and its lightweight Node server are
self-hosted and are not affiliated with other games.

Combat includes three enemy archetypes, telegraphed ranged attacks, dodge dashes,
automatic-fire weapons with reloads, combo streaks, and occasional health or
energy pickups. Every fourth elimination drops a pickup; move over it to collect
it. Enemy projectiles have a visible wind-up, so keep moving or dash to evade.
An elite Colossus arrives every fifth wave, with a telegraphed ground slam and
a dedicated health bar.

Choose between the neon lanes of Prism District, the tight industrial cover of
Ember Foundry, or the crystal formations of Astral Sanctum. Map cover blocks
movement and shots. Select a hero and arena before deployment.

Heroes have role-based health: Vanguard 350, Warden 325, Oracle 275, and Striker
250. Healing scales with each hero's maximum health, and the HUD shows current
health, maximum health, and a color-coded health bar.

## Run the game server

Install Node.js 18 or newer, then start the server from the project folder:

```bash
npm start
```

Open http://localhost:8000. The game page, social API, and live updates all use
this server. Player profiles and best scores are saved in the ignored
`data/players.json` file; profile tokens stay in the browser that created them.

## Publish a public solo-play version

GitHub Actions deploys the game to GitHub Pages whenever changes are pushed to
`main`. In the repository settings, enable Pages with **GitHub Actions** as the
build and deployment source. After the first successful workflow, share the
`https://rangersj-blip.github.io/aether-rivals/` URL. The arena is playable, but
profiles, friends, and live ranks need the Node server and are not available in
this static version.

For the full online features, the repository also includes a Render Blueprint
in `render.yaml`. That setup requires a host your players can access, plus a
paid web service and persistent disk to retain player profiles.

To play with friends on your local network, share the host machine's reachable
address and port. For friends connecting over the public internet, deploy the
server at a public address and put it behind HTTPS. Everyone must use the same
server URL. Friend codes link profiles mutually, and online presence expires
after 45 seconds without a heartbeat.

Leaderboard scores are best elimination counts submitted by the browser game;
this prototype does not have server-authoritative gameplay or anti-cheat.

## Controls

- **W / A / S / D**: move
- **Mouse**: look around (click the arena to capture the pointer)
- **Left click / Space**: fire
- **R**: reload (or hold fire until the magazine is empty for an automatic reload)
- **F**: hero tactical ability
- **Shift**: dash
- **E / Q**: ultimate
- **Esc**: release the pointer

Use the **Controls** button for the in-game field manual. Mouse sensitivity,
field of view, and sound volume can be adjusted in **Settings**.

Capture the conduit to restore health and energy. Keep enemies out of the ring;
after a successful capture, a new conduit activates elsewhere in the arena.

Choose a pilot name in **Friends** to create a profile, then share your friend
code or enter a friend's code. Use the same browser to reconnect to a profile.
The top navigation jumps between deployment, the arena, battlefeed, and ranks.

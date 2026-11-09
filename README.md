# [QUAD] Clan Homepage

Official homepage of the **QUake Army of Darkness Clan**.

This repository preserves the [QUAD] Clan Homepage, its source code and the historical material published through it.

Website: https://quad.statichost.page/

---

## About [QUAD]

[QUAD] was founded on February 24, 2000 by Arkon and Raistlin, two former [MiA] members of the Italian NetQuake community, with the goal of bringing teamplay back to Quake.

From its Italian roots, [QUAD] expanded into the wider European NetQuake scene through clanwars, duels and tournaments. Between 2001 and 2003, the clan reached its competitive peak. In the worldwide scene documented at the time by **CLQ (Champions League for Quake)**, an early service for tracking and ranking Quake players and clans, [QUAD] counts **five world titles: three in Clanwar and two individual titles in Duel and FFA**.

Beyond competition, [QUAD] became a long-lasting community built around online play, servers, LAN parties and the creation of original Quake content. Although competitive activity gradually declined, the clan never formally disappeared and many of its members remained friends over the years.

The clan celebrated its **20th anniversary in 2020** and **25th anniversary in 2025**. Today, the Clan Homepage preserves more than twenty-five years of [QUAD] history, matches, demos, achievements and memories from the NetQuake community.

---

## Website

The website uses `index.html` as its public entry point.

Individual content pages form the internal structure of the site and are displayed through the main interface inside the `main` iframe, rather than acting as separate public entry pages.

The navigation organizes the site into areas covering the clan, its members and activities, demos, news and community, Quake resources and downloadable files.

---

## Clan

The clan-related area documents the identity and history of QUake Army of Darkness and includes:

- the **[QUAD] Logo**
- **History**
- the clan **Code**
- **Members**
- information about how to **Join** [QUAD]
- **Challenge** information for other players and clans

### Members

The Members area documents the people who were part of [QUAD] and includes individual pages and historical player profiles.

Names and aliases are kept consistent throughout the restored website where possible while preserving their historical meaning.

---

## Matches and Clan Activity

### Clanwars

The **Clanwars** section documents matches played by [QUAD] against other clans, preserving results and related historical material.

### Trophies

The **Trophies** section preserves an extensive visual archive of [QUAD] competitive achievements and player results.

The collection is maintained as structured data and presented through an interactive gallery, where entries are identified by player and date and can be browsed through a dedicated viewer.

Rather than documenting only major tournament victories, the archive preserves hundreds of historical results collected by [QUAD] players over the years.

### LAN Parties

The **LAN Parties** section preserves a photographic archive of [QUAD] meetings and LAN events.

The collection includes the **QUIT Y2K** event, seven numbered [QUAD] LAN Parties held between 2001 and 2014, and the **More [QUAD] Madness** album, which collects additional photographs of clan members spanning several years.

Each event is organized as a structured album with its date, location and photographs and can be explored through an integrated gallery and image viewer.

---

## Demos

The **Demos** section preserves recorded NetQuake games through a data-driven archive for browsing, playing and analysing the collection.

### Demo Archive

Structured metadata stored in `demos-data.js` associates each `.dem` recording with information such as:

- date and event
- game mode and map
- recorded POV
- players and teams
- frag scores
- match settings
- bot information, where applicable

A single demo can contain data for more than one match.

Descriptive and statistical information is stored separately from the demo filename, allowing the archive to organize and interpret recordings without relying on filename conventions.

The archive distinguishes between:

- **Duel**
- **FFA**
- **Teamplay**
- **Vs Bots**

Entries can be filtered by game mode and provide access to the associated match information and recording.

### QUAD TV

**QUAD TV** is integrated with the Demo Archive and allows demos to be played directly in the browser from their archive entries.

### DemoStats

The structured archive data is also used to generate **DemoStats** dynamically.

DemoStats derives archive-wide totals, game-mode summaries, player and map statistics, historical trends and records directly from the available match data.

Adding correctly structured entries to `demos-data.js` therefore updates both the archive and its derived statistics without requiring a separate static statistics collection.

---

## News & Community

### News

The **News** section contains clan and website updates, with older entries retained in the **News Archive**.

### Forum

A **Bravenet Forum** has been implemented as a replacement for the former [QUAD] discussion board hosted at `forum.gamersrevolt.com/`, which is no longer available.

The original discussion board was an important part of the clan's online community and contained **336 discussions and 2,387 messages**.

The new forum restores a dedicated discussion space for the [QUAD] community while continuing the role of the original board.

### NetQuake Servers

The **NetQuake Servers** section provides a live browser for currently available NetQuake servers using real-time data supplied by QuakeHub.

For each server, the browser displays its name, current map, player count, mod and connection address. Active servers can be expanded to show the current player roster, including frags and ping.

Servers are ordered by availability and activity, addresses can be copied directly to the clipboard, and the list supports both manual and automatic refresh.

A live summary reports available and populated servers and real players currently online. The page also links to the QuakeOne Server Browser as an additional server resource.

### Interviews

The **Interviews** section preserves interviews and conversations related to players and the Quake community.

### Links

The **Links** section preserves references to relevant Quake, clan and community resources.

Given the age of the original material, some historical external websites may no longer be available.

---

## Quake Resources

The **Help** section preserves original Quake guides, references and utilities covering gameplay, maps, configuration and online play.

### Quake Bible

The **Quake Bible**, written by Dennis "Thresh" Fong, is an extensive gameplay guide covering controls, weapons, powerups and advanced playing strategies.

### Deathmatch Maps Overview

The **Deathmatch Maps Overview** provides detailed guides to classic NetQuake maps, including **DM2, DM3, DM6, E1M2 and E3M7**.

The guides cover item and powerup locations, important areas, shortcuts and basic strategies, supported by map overviews and screenshots.

### Console

The **Console** section is an extensive reference to the console commands, variables, actions, protocol commands and other settings available in **Quake 1.06**, including syntax, descriptions and cross-references.

### Command Line

The **Command Line** section documents startup parameters available in **Quake 1.09**, including options for video modes, memory, networking, dedicated servers, mods and input.

### Name Maker

The **Name Maker** provides an interactive character table for creating and previewing Quake player names, with support for copying the resulting name to the clipboard.

### Rules

The **Rules** section preserves the match regulations originally created for the **NetQuake Online Tournament**.

The rules defined how tournament matches were to be played and were subsequently adopted for other NetQuake competitions.

### Quetiquette

**Quetiquette** preserves a community-created guide to online Quake etiquette and sportsmanship, covering respectful behaviour, server conduct, chat, organized matches and teamplay.

---

## Files

The **Files** section preserves and distributes a curated collection of Quake material, combining historically useful third-party resources with original work created by [QUAD] members.

The catalogue is organized into:

- **Engines**
- **Single Player Maps**
- **Multiplayer Maps**
- **Modifications**
- **Offline Bots**
- **Improvements**
- **Tools**

Some maps, models and modifications in the archive were created or developed by members of [QUAD], making the collection both a repository of useful Quake resources and a record of the clan's own contribution to Quake content and development.

File metadata is maintained centrally in `files-data.js`. Entries can include title, version, author, date, size and description, while the category pages are generated dynamically from the shared catalogue.

The collection is designed to grow progressively as additional historical and current material is published.

---

## NetQuake

[QUAD] played **NetQuake**. The multiplayer material preserved by the site, including demos, matches, servers and related technical information, should therefore be understood in the NetQuake context unless explicitly stated otherwise.

**QuakeWorld is outside the scope of this project** and should not be used as a technical reference when maintaining NetQuake-specific functionality.

---

## Site Architecture

The website uses a lightweight client-side architecture based primarily on:

- HTML
- CSS
- JavaScript
- structured JavaScript datasets
- GLSL shaders for real-time rendering
- media and historical archive files

No web framework is required for the public website.

Structured JavaScript data is used by several sections to generate and manage content dynamically, including demos and statistics, trophies, LAN galleries and the file catalogue. GLSL vertex and fragment shaders provide the real-time Quake rendering used by the browser-based demo player.

The site therefore retains a simple web structure while supporting interactive archives, dynamically derived statistics, live server information and in-browser demo playback.

---

## Administration

The project includes a lightweight **Administration** section for routine website maintenance.

It provides tools for:

- updating and publishing **News**
- managing files available through the website
- simplifying recurring content maintenance operations
- monitoring a simple **page view counter**

Administration is part of the project but remains a maintenance facility rather than normal visitor-facing content.

---

## Mobile Support

The site is maintained for current desktop and mobile browsers while retaining the character of the original Clan Homepage.

The interface supports desktop, tablets and smartphones in both portrait and landscape orientation, with adaptations focused on usability and compatibility rather than replacing the original design.

---

## Preservation and Scope

The [QUAD] Clan Homepage is both a functioning website and a preservation project.

Historical material is retained as faithfully as practical while allowing improvements to browser compatibility, mobile usability, accessibility, navigation, discoverability and maintainability.

The main page structure is substantially complete, while the historical archive can continue to expand with additional demos, maps, files, media and other recovered material.

---

## Contributing

Changes to the repository should respect both its historical material and its technical scope.

When modifying the site:

1. Preserve the identity of **[QUAD] - QUake Army of Darkness**.
2. Keep `index.html` as the public entry point.
3. Preserve the existing navigation hierarchy.
4. Preserve historical filenames and data unless correction or normalization is necessary.
5. Keep NetQuake and QuakeWorld technically distinct.
6. Test interface changes on both desktop and mobile layouts.
7. Avoid unnecessary alteration of historical content.
8. Organize new archive material consistently with the existing site.

---

## Disclaimer

Quake and related names and assets are the property of their respective copyright holders.

Third-party maps, demos, software, images and other material remain the property of their respective authors or copyright holders.

The [QUAD] Clan Homepage is maintained as a historical preservation project.

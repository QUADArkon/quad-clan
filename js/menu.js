window.QUAD_MENU = [
  { title: "Main", items: [
    ["Clan Logo", "pages/logo/logo.html"], ["History", "pages/history/history.html"], ["Code", "pages/code/code.html"], ["Join", "pages/join/join.html"], ["Challenge", "pages/challenge/challenge.html"], ["Clanwars", "pages/clanwars/clanwars.html"], ["Demos", "pages/demos/demos.html"], ["Trophies", "pages/trophies/trophies.html"], ["LAN Parties", "pages/lan/lans.html"]
  ]},
  { title: "News & Boards", items: [
    ["News", "news/news.html"], ["News Archive", "news/archive.html"], ["[QUAD] Forum", "https://pub22.bravenet.com/forum/1809239735/"], ["NetQuake Servers", "news/servers.html"], ["Interviews", "news/interviews.html"], ["Links", "news/links.html"]
  ]},
  { title: "Hints & Guides", items: [
    ["Quake Bible", "help/bible.html"], ["Maps Overview", "help/overview.html"], ["Console 1.06", "help/console.html"], ["Command Line 1.09", "help/comlines.html"], ["Online Name Maker", "help/name.html"], ["N.O.T. Rules", "help/rules.html"], ["Quetiquette", "help/quetiquette.html"]
  ]},
  { title: "Clanmates", items: [
    ["[QUAD] Arkon", "members/arkon.html"], ["[QUAD] Bent", "members/bent.html"], ["[QUAD] Biagio", "members/biagio.html"], ["[QUAD] Hiroshi", "members/hiroshi.html"], ["[QUAD] Morpheus", "members/morpheus.html"], ["[QUAD] Polarite", "members/polarite.html"], ["[QUAD] Raistlin", "members/raistlin.html"], ["[QUAD] Ronin666", "members/ronin.html"], ["[QUAD] Wham!", "members/wham.html"], ["[QUAD] Yanosh", "members/yanosh.html"], ["[QUAD] Zizu", "members/zizu.html"]
  ]},
  { title: "Files", items: [
    ["Engines", "files/engines.html"], ["Single Player Maps", "files/maps_sp.html"], ["Multiplayer Maps", "files/maps_mp.html"], ["Modifications", "files/mods.html"], ["Offline Bots", "files/bots.html"], ["Improvements", "files/improvements.html"], ["Tools", "files/tools.html"]
  ]},
  { title: "Extra", items: [
    ["Under Construction", "undercon.html"], ["Site Mainteinance", "updating.html"], ["[QUAD] Portal", "portal.html"]
  ]}
];

window.renderQuadMenu = function(container, options = {}) {
  const mobile = !!options.mobile;
  const linkTarget = options.linkTarget || "";
  container.replaceChildren();
  window.QUAD_MENU.forEach(sectionData => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = sectionData.title;
    const ul = document.createElement("ul");
    sectionData.items.forEach(([label, href, target]) => {
      if (mobile && label === "Administration") return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = label;
      a.href = href;
      if (target) { a.target = target; a.rel = "noopener noreferrer"; }
      else if (linkTarget) a.target = linkTarget;
      li.appendChild(a);
      ul.appendChild(li);
    });
    details.append(summary, ul);
    container.appendChild(details);
  });
};


window.showQuadAdministration = function() {
  const section = window.QUAD_MENU.find(item => item.title === "News & Boards");
  if (!section) return false;
  if (!section.items.some(([label]) => label === "Administration")) {
    section.items.splice(2, 0, ["Administration", "admin/admin.html"]);
  }
  return true;
};

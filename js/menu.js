window.QUAD_MENU = [
  { title: "Main", items: [
    ["Clan Logo", "pages/logo/logo.html"], ["History", "pages/history/history.html"], ["Code", "pages/code/code.html"], ["Join", "pages/join/join.html"], ["Challenge", "pages/challenge/challenge.html"], ["Clanwars", "pages/clanwars/clanwars.html"], ["Demos", "pages/demos/demos.html"], ["Trophies", "pages/trophies/trophies.html"], ["LAN Parties", "pages/lan/lans.html"]
  ]},
  { title: "News & Boards", items: [
    ["News", "pages/news/news.html"], ["[QUAD] Forum", "https://quad.forumotion.me/"], ["[QUAD] Servers", "news/servers/servers.html"], ["Interviews", "news/interviews/interviews.html"], ["Links", "pages/links/links.html"]
  ]},
  { title: "Hints & Guides", items: [
    ["Quake Bible", "pages/help/bible.html"], ["Maps Overview", "pages/help/overview.html"], ["Console 1.06", "pages/help/console.html"], ["Command Line 1.09", "pages/help/comlines.html"], ["Online Name Maker", "pages/help/name.html"], ["N.O.T. Rules", "pages/help/rules.html"], ["Quetiquette", "pages/help/quetiquette.html"]
  ]},
  { title: "Clanmates", items: [
    ["[QUAD] Arkon", "members/arkon.html"], ["[QUAD] Bent", "members/bent.html"], ["[QUAD] Biagio", "members/biagio.html"], ["[QUAD] Hiroshi", "members/hiroshi.html"], ["[QUAD] Morpheus", "members/morpheus.html"], ["[QUAD] Polarite", "members/polarite.html"], ["[QUAD] Raistlin", "members/raistlin.html"], ["[QUAD] Ronin666", "members/ronin.html"], ["[QUAD] Wham!", "members/wham.html"], ["[QUAD] Yanosh", "members/yanosh.html"], ["[QUAD] Zizu", "members/zizu.html"]
  ]},
  { title: "Files", items: [
    ["Engines", "pages/files/engines.html"], ["Maps", "pages/files/maps.html"], ["Modifications", "pages/files/mods.html"], ["Offline Bots", "pages/files/bots.html"], ["Improvements", "pages/files/improvements.html"], ["Tools", "pages/files/tools.html"]
  ]},
  { title: "Extra", items: [
    ["Under Construction", "#"], ["Updating", "#"]
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

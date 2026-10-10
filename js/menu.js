window.QUAD_MENU = [
  { title: "Main", items: [
    ["Clan Logo", "pages/logo/logo.html"], ["History", "pages/history/history.html"], ["Code", "pages/code/code.html"], ["Members", "pages/members/members.html"], ["Join", "pages/join/join.html"], ["Challenge", "pages/challenge/challenge.html"], ["Clanwars", "pages/clanwars/clanwars.html"], ["Demos", "pages/demos/demos.html"], ["LAN Parties", "pages/lan/lans.html"]
  ]},
  { title: "News & Boards", items: [
    ["News", "pages/news/news.html"], ["News archive", "news/archive/archive.html"], ["[QUAD] Forum", "http://arkon.proboards.com/index.cgi", "_blank"], ["[QUAD] Guestbook", "http://pub23.bravenet.com/guestbook/1964437133/index.cgi", "_blank"], ["[QUAD] Servers", "news/servers/servers.html"], ["Interviews", "news/interviews/interviews.html"], ["Links", "pages/links/links.html"]
  ]},
  { title: "Hints & Guides", items: [
    ["Quake Bible", "pages/help/bible.html"], ["Maps Overview", "pages/help/overview.html"], ["Console 1.06", "pages/help/console.html"], ["Command Line 1.09", "pages/help/comlines.html"], ["Online Name Maker", "pages/help/name.html"], ["N.O.T. Rules", "pages/help/rules.html"], ["Quetiquette", "pages/help/quetiquette.html"]
  ]},
  { title: "The Elders", items: [
    ["[QUAD] Arkon", "main/members/arkon/arkon.html"], ["[QUAD] Biagio", "main/members/biagio/biagio.html"], ["[QUAD] Hiroshi", "main/members/hiroshi/hiroshi.html"], ["[QUAD] Polarite", "main/members/polarite/polarite.html"], ["[QUAD] Raistlin", "main/members/raistlin/raistlin.html"], ["[QUAD] Ronin666", "main/members/ronin/ronin.html"], ["[QUAD] Wham!", "main/members/wham/wham.html"], ["[QUAD] Yanosh", "main/members/yanosh/yanosh.html"], ["[QUAD] Zizu", "main/members/zizu/zizu.html"]
  ]},
  { title: "Files", items: [
    ["Extreme Mod", "pages/files/extreme.html"], ["CRMod", "pages/files/crmod.html"], ["QView", "pages/files/qview.html"], ["Maps", "pages/files/maps.html"], ["Bots", "pages/files/bots.html"], ["Utilities", "pages/files/utils.html"]
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
      li.appendChild(a); ul.appendChild(li);
    });
    details.append(summary, ul); container.appendChild(details);
  });
  const email = document.createElement("a");
  email.className = mobile ? "mobile-nav-email" : "nav-email";
  email.href = "mailto:filippochiantiaSPAMOFF@tiscali.it";
  email.textContent = "Email";
  container.appendChild(email);
};

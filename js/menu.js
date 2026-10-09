window.QUAD_MENU = [
  { title: "Main", items: [
    ["Clan Logo", "main/logo/logo.html"], ["History", "main/history/history.html"], ["Code", "main/code/code.html"], ["Members", "main/members/members.html"], ["Join", "main/join/join.html"], ["Challenge", "main/challenge/challenge.html"], ["Clanwars", "main/clanwars/clanwars.html"], ["Demos", "main/demos/demos.html"], ["LAN Parties", "main/lan/lans.html"]
  ]},
  { title: "News & Boards", items: [
    ["News", "news/news.html"], ["News archive", "news/archive/archive.html"], ["[QUAD] Forum", "http://arkon.proboards.com/index.cgi", "_blank"], ["[QUAD] Guestbook", "http://pub23.bravenet.com/guestbook/1964437133/index.cgi", "_blank"], ["[QUAD] Servers", "news/servers/servers.html"], ["Interviews", "news/interviews/interviews.html"], ["Links", "news/links/links.html"]
  ]},
  { title: "Hints & Guides", items: [
    ["Quake Bible", "guides/bible/bible.html"], ["Maps Overview", "guides/overview/overview.html"], ["Console 1.06", "guides/console/console.html"], ["Command Line 1.09", "guides/comlines/comlines.html"], ["Online Name Maker", "guides/name/name.html"], ["N.O.T. Rules", "guides/rules/rules.html"], ["Quetiquette", "guides/quetiquette/quetiquette.html"]
  ]},
  { title: "The Elders", items: [
    ["[QUAD] Arkon", "main/members/arkon/arkon.html"], ["[QUAD] Biagio", "main/members/biagio/biagio.html"], ["[QUAD] Hiroshi", "main/members/hiroshi/hiroshi.html"], ["[QUAD] Polarite", "main/members/polarite/polarite.html"], ["[QUAD] Raistlin", "main/members/raistlin/raistlin.html"], ["[QUAD] Ronin666", "main/members/ronin/ronin.html"], ["[QUAD] Wham!", "main/members/wham/wham.html"], ["[QUAD] Yanosh", "main/members/yanosh/yanosh.html"], ["[QUAD] Zizu", "main/members/zizu/zizu.html"]
  ]},
  { title: "Files", items: [
    ["Extreme Mod", "files/extreme/extreme.html"], ["CRMod", "files/crmod/crmod.html"], ["QView", "files/qview/qview.html"], ["Maps", "files/maps/maps.html"], ["Bots", "files/bots/bots.html"], ["Utilities", "files/utils/utils.html"]
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
  const email = document.createElement("a");
  email.className = mobile ? "mobile-nav-email" : "nav-email";
  email.href = "mailto:filippochiantiaSPAMOFF@tiscali.it";
  email.textContent = "Email";
  container.appendChild(email);
};

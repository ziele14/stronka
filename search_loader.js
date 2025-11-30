window.SEARCH_PAGES = [
  "index.html",
  "wydarzenia.html",
  "grafoman.html",
  "dzial_kulinarny.html",
  "szmonces_inzynierski.html",
  "story1.html",
  "dwoch_braci.html"
  // dopisuj tu nowe podstrony
];

window.SEARCH_DATA = [];

async function loadSearchData() {
  for (const url of window.SEARCH_PAGES) {
    try {
      const html = await fetch(url).then(r => r.text());
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Zbieramy tytuł podstrony
      const title = doc.querySelector("h1, h2")?.innerText || url;

      // Pobieramy cały tekst (bez tagów)
      const content = doc.body.innerText.replace(/\s+/g, " ");

      window.SEARCH_DATA.push({
        title,
        url,
        content: content.toLowerCase()
      });

    } catch (err) {
      console.error("Nie mogę pobrać:", url, err);
    }
  }

  console.log("SEARCH_DATA załadowane:", window.SEARCH_DATA);
}

loadSearchData();

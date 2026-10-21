/* Dati condivisi tra Compra, Vendi e Gestione. Salvati nel browser di chi usa il sito. */
(function () {
  var KA = "motorvia.annunci.v1", KR = "motorvia.richieste.v1";
  var memA = null, memR = null;

  function load(k) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

  var SELLERS = [
    { nome: "Marco Ferri", tel: "+39 333 000 0101", mail: "marco.ferri@esempio.it" },
    { nome: "Giulia Conti", tel: "+39 333 000 0102", mail: "giulia.conti@esempio.it" },
    { nome: "Paolo Riva", tel: "+39 333 000 0103", mail: "paolo.riva@esempio.it" },
    { nome: "Elena Gatti", tel: "+39 333 000 0104", mail: "elena.gatti@esempio.it" },
    { nome: "Davide Longo", tel: "+39 333 000 0105", mail: "davide.longo@esempio.it" },
    { nome: "Sara Moretti", tel: "+39 333 000 0106", mail: "sara.moretti@esempio.it" }
  ];

  function seedA() {
    var rows = [
      [1, "Fiat", "Panda", "1.0 Hybrid City Life", 2022, 28400, 12900, "Ibrida", "Manuale", 70, "utilitaria", "#9AA3A8", "Una sola proprietaria, tagliandi in concessionaria. Adatta alla città e ai parcheggi stretti.", ["Clima manuale", "Bluetooth", "Sensori di parcheggio"], "pubblicato", 0, 6],
      [2, "Volkswagen", "Golf", "2.0 TDI Life", 2020, 76200, 17400, "Diesel", "Automatico", 150, "berlina", "#2B4C7E", "Cambio DSG, cronologia tagliandi completa. Ottima per chi fa molta autostrada.", ["Navigatore", "Cruise adattivo", "Apple CarPlay"], "pubblicato", 1, 20],
      [3, "Toyota", "Yaris", "1.5 Hybrid Active", 2021, 41800, 15600, "Ibrida", "Automatico", 116, "utilitaria", "#B8322B", "Consumi reali sotto i 5 litri ogni 100 km. Garanzia batteria ibrida ancora attiva.", ["Telecamera posteriore", "Clima automatico", "Android Auto"], "pubblicato", 2, 14],
      [4, "Audi", "Q3", "35 TDI S tronic Business", 2019, 98700, 21900, "Diesel", "Automatico", 150, "suv", "#23282B", "Ben tenuta, interni in ottimo stato. Quattro tagliandi documentati.", ["Virtual cockpit", "Sedili riscaldati", "Portellone elettrico"], "pubblicato", 3, 25],
      [5, "Renault", "Clio", "1.0 TCe GPL Zen", 2021, 52300, 11800, "GPL", "Manuale", 100, "utilitaria", "#E08A1E", "Doppia alimentazione benzina e GPL, ideale per ridurre la spesa di carburante.", ["Schermo 7\"", "Clima automatico", "Cerchi in lega"], "pubblicato", 4, 9],
      [6, "BMW", "Serie 3 Touring", "320d xDrive Business", 2018, 121000, 19800, "Diesel", "Automatico", 190, "station", "#9AA3A8", "Station wagon con trazione integrale. Tagliandi BMW e gomme invernali incluse.", ["Trazione integrale", "Navigatore", "Gancio traino"], "pubblicato", 5, 31],
      [7, "Tesla", "Model 3", "Long Range Dual Motor", 2021, 54600, 32900, "Elettrica", "Automatico", 440, "berlina", "#E9ECEE", "Autonomia dichiarata oltre 500 km. Salute della batteria certificata in officina.", ["Autopilot", "Tetto in vetro", "Ricarica rapida"], "pubblicato", 0, 4],
      [8, "Fiat", "500", "1.2 Lounge", 2017, 63100, 8200, "Benzina", "Manuale", 69, "utilitaria", "#7FB5C9", "Tetto panoramico, neopatentati ammessi. Perfetta come seconda auto.", ["Tetto panoramico", "Radio con USB", "Cerchi in lega"], "pubblicato", 1, 18],
      [9, "Volkswagen", "Tiguan", "1.5 TSI Life DSG", 2022, 33900, 28500, "Benzina", "Automatico", 150, "suv", "#5D6B50", "SUV compatto con ottimo spazio per famiglia. Ancora coperto da garanzia ufficiale fino a fine anno.", ["Cruise adattivo", "Telecamera 360°", "Fari matrix LED"], "pubblicato", 2, 12],
      [10, "Toyota", "Corolla Touring Sports", "1.8 Hybrid Business", 2020, 68700, 18900, "Ibrida", "Automatico", 122, "station", "#9AA3A8", "Bagagliaio da 598 litri, consumi contenuti anche in autostrada.", ["Safety Sense", "Clima bizona", "Android Auto"], "revisione", 3, 1],
      [11, "Renault", "Captur", "1.5 Blue dCi Intens", 2019, 87400, 13600, "Diesel", "Manuale", 95, "suv", "#E08A1E", "Crossover con tetto a contrasto. Distribuzione e freni sostituiti di recente.", ["Navigatore", "Keycard", "Cerchi da 17\""], "pubblicato", 4, 7],
      [12, "BMW", "Serie 1", "118i Business Advantage", 2023, 14200, 26700, "Benzina", "Automatico", 140, "berlina", "#8B2E3A", "Quasi nuova, garanzia di fabbrica residua. Un solo proprietario aziendale.", ["Head-up display", "Sedili riscaldati", "Ricarica wireless"], "venduto", 5, 40, 25900, 9, "Luca Bassi"],
      [13, "Fiat", "Tipo", "1.6 Mjt Easy", 2019, 71000, 10400, "Diesel", "Manuale", 120, "berlina", "#9AA3A8", "Berlina spaziosa con tagliandi regolari.", ["Clima automatico", "Cruise control"], "venduto", 0, 80, 9900, 38, "Anna Greco"],
      [14, "Peugeot", "208", "1.2 PureTech Allure", 2020, 39800, 12900, "Benzina", "Manuale", 82, "utilitaria", "#2B4C7E", "Ottime condizioni, un solo proprietario.", ["Schermo 7\"", "Sensori posteriori"], "venduto", 1, 70, 12400, 52, "Matteo Serra"],
      [15, "Jeep", "Renegade", "1.6 Mjt Longitude", 2018, 94500, 15200, "Diesel", "Manuale", 120, "suv", "#5D6B50", "SUV compatto, tagliandi in rete ufficiale.", ["Navigatore", "Cerchi da 17\""], "venduto", 2, 95, 14600, 71, "Chiara Fabbri"],
      [16, "Ford", "Fiesta", "1.1 Titanium", 2019, 58200, 9800, "Benzina", "Manuale", 85, "utilitaria", "#B8322B", "Consumi bassi, ideale per neopatentati.", ["Bluetooth", "Clima manuale"], "venduto", 3, 120, 9300, 96, "Franco Neri"],
      [17, "Mini", "Cooper", "1.5 Business", 2020, 41200, 18400, "Benzina", "Automatico", 136, "utilitaria", "#23282B", "Allestimento Business con cambio automatico.", ["Navigatore", "Fari LED"], "venduto", 4, 145, 17700, 120, "Irene Costa"],
      [18, "Skoda", "Octavia Wagon", "2.0 TDI Style", 2019, 112000, 16900, "Diesel", "Automatico", 150, "station", "#E9ECEE", "Station wagon per chi percorre molti chilometri.", ["Cruise adattivo", "Gancio traino"], "venduto", 5, 35, 16300, 15, "Roberto Villa"]
    ];
    return rows.map(function (r) {
      var s = SELLERS[r[15]];
      var a = {
        id: r[0], marca: r[1], modello: r[2], versione: r[3], anno: r[4], km: r[5], prezzo: r[6],
        carb: r[7], cambio: r[8], cv: r[9], tipo: r[10], hex: r[11], desc: r[12], opt: r[13],
        stato: r[14], venditore: { nome: s.nome, tel: s.tel, mail: s.mail }, foto: [], miei: false, data: daysAgo(r[16])
      };
      if (r[14] === "venduto") { a.prezzoVendita = r[17]; a.dataVendita = daysAgo(r[18]); a.acquirente = r[19]; }
      return a;
    });
  }
  function seedR() {
    return [
      { id: 1, annuncioId: 2, nome: "Federica Monti", tel: "+39 347 000 0201", mail: "", msg: "Buongiorno, è possibile vedere l'auto sabato mattina?", data: daysAgo(1), stato: "nuova" },
      { id: 2, annuncioId: 3, nome: "Andrea Pellegrini", tel: "", mail: "a.pellegrini@esempio.it", msg: "L'auto ha la garanzia sulla batteria ibrida? Fino a quando?", data: daysAgo(2), stato: "nuova" },
      { id: 3, annuncioId: 7, nome: "Simone Rossi", tel: "+39 347 000 0203", mail: "", msg: "Accettate una permuta con una Golf del 2016?", data: daysAgo(6), stato: "gestita" }
    ];
  }

  function getA() { var v = load(KA); if (!v) { v = memA || seedA(); save(KA, v); } memA = v; return v; }
  function setA(v) { memA = v; return save(KA, v); }
  function getR() { var v = load(KR); if (!v) { v = memR || seedR(); save(KR, v); } memR = v; return v; }
  function setR(v) { memR = v; return save(KR, v); }

  var eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  var nf = new Intl.NumberFormat("it-IT");

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rif(c) { return "MV " + String(c.id).padStart(3, "0"); }

  var SHAPES = {
    utilitaria: { body: "M20 70 L24 56 Q28 48 44 46 L78 28 Q84 24 96 24 L150 24 Q160 24 168 32 L190 48 Q214 50 220 62 L222 70 Z", win: "M82 44 L98 30 L148 30 Q154 30 158 36 L170 44 Z" },
    suv: { body: "M14 72 L16 52 Q18 44 32 42 L70 38 L84 20 Q88 16 98 16 L168 16 Q178 16 184 24 L200 40 Q222 42 226 56 L228 72 Z", win: "M76 38 L88 24 L166 24 Q172 24 176 30 L190 38 Z" },
    berlina: { body: "M12 70 L16 56 Q22 48 44 46 L84 44 L106 24 Q110 20 120 20 L156 20 Q168 20 176 30 L192 44 Q222 48 228 60 L228 70 Z", win: "M90 44 L108 28 L154 28 Q162 28 168 34 L180 44 Z" },
    station: { body: "M14 70 L18 54 Q22 46 44 44 L80 42 L98 22 Q102 18 112 18 L196 18 Q204 18 206 28 L208 44 Q226 48 228 60 L228 70 Z", win: "M86 42 L102 26 L198 26 L200 42 Z" }
  };
  function carSvg(c) {
    var s = SHAPES[c.tipo] || SHAPES.berlina;
    return '<svg viewBox="0 0 240 96" role="img" aria-label="' + esc(c.marca) + ' ' + esc(c.modello) + '">' +
      '<ellipse cx="120" cy="88" rx="104" ry="5" fill="#000" opacity=".16"/>' +
      '<path d="' + s.body + '" fill="' + esc(c.hex) + '" stroke="#000" stroke-opacity=".35" stroke-width="1.5"/>' +
      '<path d="' + s.win + '" fill="#0E1A22" opacity=".82"/>' +
      '<circle cx="62" cy="74" r="14" fill="#161616"/><circle cx="62" cy="74" r="6" fill="#B9BEC2"/>' +
      '<circle cx="180" cy="74" r="14" fill="#161616"/><circle cx="180" cy="74" r="6" fill="#B9BEC2"/></svg>';
  }
  function artHtml(c) {
    var tag = '<span class="plate tag" aria-hidden="true"><span class="eu">I</span><span class="num">' + rif(c) + '</span></span>';
    if (c.foto && c.foto.length) return '<div class="art photo">' + tag + '<img src="' + c.foto[0] + '" alt="' + esc(c.marca) + ' ' + esc(c.modello) + '"></div>';
    return '<div class="art">' + tag + carSvg(c) + '</div>';
  }
  function cardInner(c) {
    return artHtml(c) +
      '<div class="body"><h3>' + esc(c.marca) + ' ' + esc(c.modello) + '</h3>' +
      '<p class="ver">' + esc(c.versione || "") + '</p>' +
      '<div class="specs"><span>' + esc(c.anno) + '</span><span>' + nf.format(c.km) + ' km</span><span>' + esc(c.carb) + '</span><span>' + esc(c.cambio) + '</span></div>' +
      '<p class="price">' + (c.prezzo > 0 ? eur.format(c.prezzo) : "Prezzo da definire") + '</p></div>';
  }
  var STATI = { pubblicato: "In vendita", revisione: "In revisione", venduto: "Venduta", rifiutato: "Non pubblicata" };

  window.MV = {
    esc: esc, rif: rif, eur: eur, nf: nf, STATI: STATI, carSvg: carSvg, artHtml: artHtml, cardInner: cardInner,
    fmtData: function (iso) { return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }); },
    annunci: getA,
    richieste: getR,
    nextId: function (arr) { return arr.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; },
    addAnnuncio: function (a) { var l = getA(); a.id = MV.nextId(l); l.push(a); return setA(l) ? a : null; },
    updAnnuncio: function (id, patch) { var l = getA(); l.forEach(function (x) { if (x.id === id) Object.keys(patch).forEach(function (k) { x[k] = patch[k]; }); }); return setA(l); },
    delAnnuncio: function (id) { setA(getA().filter(function (x) { return x.id !== id; })); },
    addRichiesta: function (r) { var l = getR(); r.id = MV.nextId(l); l.push(r); return setR(l); },
    updRichiesta: function (id, patch) { var l = getR(); l.forEach(function (x) { if (x.id === id) Object.keys(patch).forEach(function (k) { x[k] = patch[k]; }); }); return setR(l); },
    reset: function () { memA = null; memR = null; try { localStorage.removeItem(KA); localStorage.removeItem(KR); } catch (e) {} getA(); getR(); }
  };
})();

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PRAG_DOSTAVE = 5000;

const NAJAVE = [
  "Besplatna dostava preko 5.000 RSD",
  "Plaćanje pouzećem širom Srbije",
  "Ručno izrađeno u malim serijama",
];

const MENI = [
  ["Prodavnica", "#proizvodi"],
  ["Setovi i pokloni", "#kategorije"],
  ["Sastojci", "#sastojci"],
  ["Naša priča", "#prica"],
  ["Kontakt", "#kontakt"],
];

const VREDNOSTI = [
  { naslov: "Ručna izrada", tekst: "Svaka serija nastaje u malim količinama, ručno, kako bi proizvod do vas stigao svež i pun aktivnih sastojaka." },
  { naslov: "Prirodni sastojci", tekst: "Hladno ceđena biljna ulja, puteri i ekstrakti. Formule sa 99 do 100% sastojaka prirodnog porekla." },
  { naslov: "Stručno formulisano", tekst: "Formule su razvijene uz znanje iz hemije i farmacije, sa pažljivo odabranim koncentracijama koje imaju smisla za kožu." },
];

const KATEGORIJE = [
  { naziv: "Lice", opis: "Serumi i kreme", slika: "/img/kat-lice.jpg" },
  { naziv: "Telo", opis: "Nega za svaki dan", slika: "/img/kat-telo.jpg" },
  { naziv: "Usne i ruke", opis: "Balzami i zaštita", slika: "/img/kat-usne.jpg" },
  { naziv: "Setovi i pokloni", opis: "Za nekog posebnog", slika: "/img/kat-setovi.jpg" },
];

const TIPOVI = [
  ["sve", "Sve"],
  ["suva", "Suva"],
  ["masna", "Masna"],
  ["mesovita", "Mešovita"],
  ["osetljiva", "Osetljiva"],
];

const PROIZVODI = [
  { naziv: "B3 Serum Niacinamid 10%", kategorija: "Serum za lice", sastojak: "Niacinamid 10%", cena: 2290, slika: "/img/b3-serum.jpg", hover: "/img/prica.jpg", koza: ["masna", "mesovita"] },
  { naziv: "Serum za lice", kategorija: "Serum za lice", sastojak: "100% biljna ulja", cena: 2490, slika: "/img/face-serum.jpg", hover: "/img/kat-lice.jpg", koza: ["suva", "mesovita", "osetljiva"] },
  { naziv: "Anti Age krema", kategorija: "Krema za lice", sastojak: "Smilje i ulje pšeničnih klica", cena: 2890, slika: "/img/anti-age-krema.jpg", hover: "/img/kat-telo.jpg", koza: ["suva", "osetljiva"] },
  { naziv: "Hidratantna krema za masnu kožu", kategorija: "Krema za lice", sastojak: "Kamilica i ulje brazilskog oraha", cena: 2590, slika: "/img/hidratantna-krema.jpg", hover: "/img/kat-setovi.jpg", koza: ["masna", "mesovita"] },
];

const SASTOJCI = [
  { naziv: "Niacinamid", latinski: "Vitamin B3", tekst: "Ujednačava ten, sužava vidljivost pora i jača zaštitnu barijeru kože. Pomaže koži da zadrži vlagu i reguliše lučenje sebuma." },
  { naziv: "Smilje", latinski: "Helichrysum italicum", tekst: "Ulje smilja poznato je po umirujućem i regenerativnom dejstvu. Podržava obnovu kože i doprinosi elastičnosti zrele kože." },
  { naziv: "Ulje pšeničnih klica", latinski: "Triticum vulgare", tekst: "Prirodno bogato vitaminom E, snažnim antioksidansom. Neguje i omekšava suvu kožu i štiti je od spoljašnjih uticaja." },
];

const rsd = (n) => n.toLocaleString("sr-RS") + " RSD";
const Strelica = () => <span className="arrow" aria-hidden>→</span>;

export default function Home() {
  const [stavke, setStavke] = useState([]);
  const [korpaOtvorena, setKorpaOtvorena] = useState(false);
  const [meni, setMeni] = useState(false);
  const [tip, setTip] = useState("sve");
  const [filtrirano, setFiltrirano] = useState(false);
  const [najava, setNajava] = useState(0);
  const [skriven, setSkriven] = useState(false);
  const [skrolovano, setSkrolovano] = useState(false);
  const [prijavljen, setPrijavljen] = useState(false);

  const brojStavki = stavke.reduce((s, x) => s + x.kol, 0);
  const ukupno = stavke.reduce((s, x) => s + x.kol * x.cena, 0);
  const prikazani = tip === "sve" ? PROIZVODI : PROIZVODI.filter((p) => p.koza.includes(tip));

  // Otkrivanje sekcija pri skrolovanju
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -12% 0px" }
    );
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tip]);

  // Header se sklanja pri skrolu nadole, parallax slika
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const px = [...document.querySelectorAll("[data-px]")];
    let poslednji = 0, raf = 0;
    const tick = () => {
      raf = 0;
      const y = scrollY;
      setSkrolovano(y > 10);
      setSkriven(y > 300 && y > poslednji);
      poslednji = y;
      if (reduced) return;
      for (const el of px) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const pomak = (r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.px);
        el.style.transform = `translate3d(0, ${pomak.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(tick));
    tick();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Najave na vrhu se smenjuju
  useEffect(() => {
    const t = setInterval(() => setNajava((i) => (i + 1) % NAJAVE.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Zaključaj skrol i zatvori na Esc dok je korpa ili meni otvoren
  useEffect(() => {
    const otvoreno = korpaOtvorena || meni;
    document.body.style.overflow = otvoreno ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && (setKorpaOtvorena(false), setMeni(false));
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [korpaOtvorena, meni]);

  function dodaj(p) {
    setStavke((s) => s.some((x) => x.naziv === p.naziv)
      ? s.map((x) => (x.naziv === p.naziv ? { ...x, kol: x.kol + 1 } : x))
      : [...s, { ...p, kol: 1 }]);
    setKorpaOtvorena(true);
  }
  function promeni(naziv, d) {
    setStavke((s) => s.map((x) => (x.naziv === naziv ? { ...x, kol: x.kol + d } : x)).filter((x) => x.kol > 0));
  }

  return (
    <>
      {/* 1. Traka sa najavama */}
      <div className="bg-noc text-krem/90 text-[0.62rem] sm:text-[0.66rem] tracking-[0.16em] sm:tracking-[0.2em] uppercase h-9 flex items-center justify-center px-4 overflow-hidden">
        <p key={najava} className="fade-up text-center" aria-live="polite">{NAJAVE[najava]}</p>
      </div>

      {/* 2. Header */}
      <header className={`sticky top-0 z-40 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease)] border-b ${skrolovano ? "bg-krem/90 backdrop-blur-md border-bez" : "bg-krem border-transparent"} ${skriven && !korpaOtvorena && !meni ? "-translate-y-full" : ""}`}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 h-16 lg:h-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center">
            <button onClick={() => setMeni(true)} className="lg:hidden text-[0.7rem] tracking-[0.18em] uppercase" aria-expanded={meni}>Meni</button>
            <nav className="hidden lg:flex gap-8 text-[0.68rem] tracking-[0.18em] uppercase">
              {MENI.slice(0, 3).map(([m, h]) => <a key={m} href={h} className="ul">{m}</a>)}
            </nav>
          </div>

          <a href="#" className="flex flex-col items-center leading-none" aria-label="Addition Cosmetics, početna">
            <span className="font-serif text-[1.65rem] lg:text-[1.9rem] tracking-[0.14em]">addition</span>
            <span className="text-[0.5rem] tracking-[0.55em] uppercase mt-1 text-tinta/70 pl-[0.55em]">cosmetics</span>
          </a>

          <div className="flex items-center justify-end gap-6 text-[0.68rem] tracking-[0.18em] uppercase">
            <nav className="hidden lg:flex gap-8">
              {MENI.slice(3).map(([m, h]) => <a key={m} href={h} className="ul">{m}</a>)}
            </nav>
            <a href="#" aria-label="Pretraga" className="hidden sm:block hover:text-smedja transition-colors">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            </a>
            <button onClick={() => setKorpaOtvorena(true)} className="ul">
              Korpa (<span key={brojStavki} className="inline-block fade-up">{brojStavki}</span>)
            </button>
          </div>
        </div>
      </header>

      {/* Mobilni meni preko celog ekrana */}
      <div className={`fixed inset-0 z-50 bg-krem transition-[clip-path] duration-[900ms] ease-[var(--ease)] lg:hidden ${meni ? "[clip-path:inset(0)]" : "[clip-path:inset(0_0_100%_0)] pointer-events-none"}`} inert={!meni}>
        <div className="h-16 px-4 flex items-center justify-between border-b border-bez">
          <span className="font-serif text-2xl tracking-[0.14em]">addition</span>
          <button onClick={() => setMeni(false)} className="text-[0.7rem] tracking-[0.18em] uppercase">Zatvori</button>
        </div>
        <nav className="px-4 pt-10 flex flex-col">
          {MENI.map(([m, h], i) => (
            <a key={m} href={h} onClick={() => setMeni(false)} className="font-serif text-[2.6rem] leading-tight py-2 border-b border-bez/70 flex justify-between items-center">
              <span className={meni ? "fade-up" : "opacity-0"} style={{ "--d": `${200 + i * 70}ms` }}>{m}</span>
              <span className={`text-base text-smedja ${meni ? "fade-in" : "opacity-0"}`} style={{ "--d": `${500 + i * 70}ms` }}>0{i + 1}</span>
            </a>
          ))}
        </nav>
        <p className={`px-4 mt-10 text-sm text-tinta/60 ${meni ? "fade-in" : "opacity-0"}`} style={{ "--d": "800ms" }}>addition.cosmetics@gmail.com</p>
      </div>

      <main>
        {/* 3. Hero */}
        <section className="relative bg-noc text-krem grid lg:grid-cols-2 lg:min-h-[calc(100svh-112px)] overflow-hidden">
          <div className="relative h-[48svh] sm:h-[60svh] lg:h-auto lg:order-2 overflow-hidden">
            <div className="absolute inset-0 kenburns">
              <Image src="/img/face-serum.jpg" alt="Kap seruma za lice Addition na pipeti" fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[30%_40%]" />
            </div>
            {/* Rotirajući pečat */}
            <div className="absolute right-5 bottom-5 lg:right-10 lg:bottom-10 w-24 h-24 lg:w-32 lg:h-32 fade-in" style={{ "--d": "1400ms" }}>
              <svg viewBox="0 0 100 100" className="spin w-full h-full text-krem/85" aria-hidden>
                <defs><path id="krug" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
                <text fontSize="8.6" letterSpacing="2.6" fill="currentColor" style={{ fontFamily: "var(--font-manrope)", textTransform: "uppercase" }}>
                  <textPath href="#krug">Ručna izrada · 99% prirodno · </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 grid place-items-center font-serif italic text-2xl lg:text-3xl text-krem">a</span>
            </div>
          </div>

          <div className="relative flex flex-col justify-center px-5 sm:px-10 lg:px-16 xl:px-24 py-14 lg:py-20">
            <p className="eyebrow !text-bez/70 fade-up" style={{ "--d": "300ms" }}>Prirodna kozmetika · Srbija</p>
            <h1 className="font-serif font-normal text-[3.1rem] leading-[1] sm:text-7xl xl:text-[6.2rem] mt-6 tracking-[-0.01em]">
              <span className="line"><span style={{ "--d": "400ms" }}>Priroda</span></span>
              <span className="line"><span style={{ "--d": "520ms" }}>u formuli.</span></span>
              <span className="line"><span style={{ "--d": "640ms" }} className="italic text-bez">Nauka u</span></span>
              <span className="line"><span style={{ "--d": "760ms" }} className="italic text-bez">svakoj kapi.</span></span>
            </h1>
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-krem/70 fade-up" style={{ "--d": "1100ms" }}>
              Ručno rađena kozmetika iza koje stoji znanje iz hemije i farmacije. Promišljene formule, sastojci čije
              dejstvo razumemo, ništa suvišno.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 fade-up" style={{ "--d": "1250ms" }}>
              <a href="#proizvodi" className="btn btn-light !bg-krem !text-tinta [--sweep:var(--color-bez)]">Pogledaj proizvode <Strelica /></a>
              <a href="#prica" className="btn btn-light">Naša priča</a>
            </div>
          </div>
        </section>

        {/* 4. Tri vrednosti */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
          <div className="grid md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-bez">
            {VREDNOSTI.map((v, i) => (
              <div key={v.naslov} data-reveal style={{ "--d": `${i * 140}ms` }} className="md:px-10 lg:px-14 first:md:pl-0 last:md:pr-0">
                <p className="font-serif italic text-smedja text-xl">0{i + 1}</p>
                <h2 className="font-serif text-[2rem] lg:text-[2.4rem] mt-3 leading-none">{v.naslov}</h2>
                <p className="mt-5 text-sm leading-relaxed text-tinta/70 max-w-sm">{v.tekst}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Kategorije */}
        <section id="kategorije" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32 scroll-mt-20">
          <div className="flex items-end justify-between gap-6 mb-10 lg:mb-14" data-reveal>
            <div>
              <p className="eyebrow">Kategorije</p>
              <h2 className="font-serif text-[2.6rem] lg:text-6xl mt-4 leading-[1.02]">Nega za <em className="text-smedja">celo telo</em></h2>
            </div>
            <a href="#" className="hidden sm:inline ul text-[0.68rem] tracking-[0.18em] uppercase">Sve kategorije →</a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {KATEGORIJE.map((k, i) => (
              <a key={k.naziv} href="#" className="group block" data-reveal style={{ "--d": `${i * 110}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-bez" data-reveal="img" style={{ "--d": `${i * 110}ms` }}>
                  <div className="absolute inset-0 zoom">
                    <Image src={k.slika} alt={k.naziv} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-noc/0 group-hover:bg-noc/15 transition-colors duration-700" />
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <h3 className="font-serif text-[1.6rem] lg:text-3xl leading-none">{k.naziv}</h3>
                  <span className="text-smedja -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" aria-hidden>→</span>
                </div>
                <p className="text-[0.68rem] tracking-[0.16em] uppercase text-tinta/55 mt-2">{k.opis}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Pokretna traka */}
        <div className="border-y border-bez py-6 lg:py-8 overflow-hidden" aria-hidden>
          <div className="marquee">
            {[0, 1].map((n) => (
              <div key={n} className="flex shrink-0 items-center font-serif text-4xl lg:text-6xl whitespace-nowrap">
                {["Ručna izrada", "Prirodni sastojci", "Stručno formulisano", "Male serije"].map((t, i) => (
                  <span key={t} className="flex items-center">
                    <span className={i % 2 ? "italic text-smedja" : ""}>{t}</span>
                    <span className="mx-8 lg:mx-12 text-2xl text-smedja/60">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 6. Najtraženiji proizvodi */}
        <section id="proizvodi" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-24 lg:py-32 scroll-mt-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8" data-reveal>
            <div>
              <p className="eyebrow">Najtraženije</p>
              <h2 className="font-serif text-[2.6rem] lg:text-6xl mt-4 leading-[1.02]">Omiljeni izbor<br /><em className="text-smedja">naših kupaca</em></h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3" role="group" aria-label="Filter po tipu kože">
              <span className="text-[0.68rem] tracking-[0.16em] uppercase text-tinta/50 w-full sm:w-auto">Tip kože</span>
              {TIPOVI.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => { setTip(id); setFiltrirano(true); }}
                  aria-pressed={tip === id}
                  aria-current={tip === id}
                  className={`ul font-serif text-xl lg:text-2xl transition-colors ${tip === id ? "text-tinta italic" : "text-tinta/45 hover:text-tinta"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div key={tip} className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12 sm:gap-x-5" data-reveal={filtrirano ? undefined : ""}>
            {prikazani.map((p, i) => (
              <article key={p.naziv} className={`group flex flex-col ${filtrirano ? "fade-up" : ""}`} style={{ "--d": `${i * 90}ms` }}>
                <div className="relative aspect-[4/5] overflow-hidden bg-bez">
                  <Image src={p.slika} alt={p.naziv} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-opacity duration-700 group-hover:opacity-0" />
                  <Image src={p.hover} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-0 scale-110 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease)] group-hover:opacity-100 group-hover:scale-100" />
                  <button
                    onClick={() => dodaj(p)}
                    className="hidden lg:flex btn btn-dark absolute left-3 right-3 bottom-3 translate-y-[calc(100%+12px)] group-hover:translate-y-0 transition-transform duration-500 ease-[var(--ease)]"
                  >
                    Dodaj u korpu · {rsd(p.cena)}
                  </button>
                </div>
                <p className="eyebrow mt-5 !text-[0.6rem]">{p.kategorija}</p>
                <h3 className="font-serif text-[1.35rem] sm:text-[1.65rem] mt-2 leading-[1.1]">{p.naziv}</h3>
                <p className="text-xs sm:text-sm text-tinta/60 mt-2 italic">{p.sastojak}</p>
                <p className="mt-3 text-sm font-semibold tracking-wide">{rsd(p.cena)}</p>
                <button onClick={() => dodaj(p)} className="lg:hidden btn btn-dark mt-4 !px-3 !text-[0.62rem]">Dodaj u korpu</button>
              </article>
            ))}
          </div>
        </section>

        {/* 7. Naša priča */}
        <section id="prica" className="bg-noc text-krem scroll-mt-20 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative h-[70svh] lg:h-auto lg:min-h-[820px] overflow-hidden">
              <div data-px="-0.15" className="absolute -inset-y-[12%] inset-x-0 will-change-transform">
                <Image src="/img/prica.jpg" alt="Addition B3 serum sa pipetom" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="px-5 sm:px-10 lg:px-20 xl:px-28 py-20 lg:py-32 flex flex-col justify-center">
              <p className="eyebrow !text-bez/70" data-reveal>Naša priča</p>
              <h2 className="font-serif text-[2.6rem] lg:text-[4.2rem] mt-6 leading-[1.02]" data-reveal style={{ "--d": "100ms" }}>
                Iz laboratorije znanja, <em className="text-bez">u vaše ruke.</em>
              </h2>
              <p className="mt-8 leading-relaxed text-krem/70 max-w-lg" data-reveal style={{ "--d": "200ms" }}>
                Addition je nastao iz jednostavnog pitanja: šta zaista stavljamo na kožu? Iza brenda stoji znanje iz
                hemije i farmacije, i uverenje da prirodna kozmetika može biti i delotvorna i iskrena.
              </p>
              <p className="mt-4 leading-relaxed text-krem/70 max-w-lg" data-reveal style={{ "--d": "280ms" }}>
                Svaki proizvod ručno pravimo u malim serijama, sa sastojcima koje biramo zbog njihovog dejstva, a ne
                zbog trenda. Samo ono što koži treba.
              </p>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-krem/15 pt-8 max-w-lg">
                {[["99%", "prirodnih sastojaka u kremama"], ["100%", "prirodan serum za lice"], ["Ručno", "u malim serijama"]].map(([b, t], i) => (
                  <div key={b} data-reveal style={{ "--d": `${360 + i * 110}ms` }}>
                    <dt className="font-serif text-3xl lg:text-[2.6rem] text-bez leading-none">{b}</dt>
                    <dd className="mt-2 text-[0.7rem] leading-snug text-krem/55">{t}</dd>
                  </div>
                ))}
              </dl>
              <div data-reveal style={{ "--d": "600ms" }}>
                <a href="#" className="btn btn-light mt-12">Upoznaj nas <Strelica /></a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Sastojci u fokusu */}
        <section id="sastojci" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-24 lg:py-32 scroll-mt-20">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24">
            <div className="lg:sticky lg:top-32 self-start" data-reveal>
              <p className="eyebrow">Sastojci u fokusu</p>
              <h2 className="font-serif text-[2.6rem] lg:text-6xl mt-4 leading-[1.02]">Znamo šta radi <em className="text-smedja">i zašto.</em></h2>
              <p className="mt-6 text-sm leading-relaxed text-tinta/70 max-w-sm">
                Svaki sastojak ima svoju ulogu. Biramo ih prema dokazanom dejstvu i koristimo u koncentracijama koje koža zaista oseti.
              </p>
            </div>
            <ol className="border-t border-tinta/15">
              {SASTOJCI.map((s, i) => (
                <li key={s.naziv} data-reveal style={{ "--d": `${i * 120}ms` }} className="group relative border-b border-tinta/15 py-9 lg:py-12 grid grid-cols-[3rem_1fr] lg:grid-cols-[4.5rem_1fr_1.1fr] gap-x-4 lg:gap-x-8 gap-y-3">
                  <span className="absolute left-0 bottom-[-1px] h-px w-full bg-smedja origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[var(--ease)]" aria-hidden />
                  <span className="font-serif italic text-smedja text-xl pt-1">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-3xl lg:text-[2.6rem] leading-none transition-transform duration-700 ease-[var(--ease)] group-hover:translate-x-2">{s.naziv}</h3>
                    <p className="text-xs italic tracking-wide text-smedja mt-2">{s.latinski}</p>
                  </div>
                  <p className="col-start-2 lg:col-start-3 text-sm leading-relaxed text-tinta/70">{s.tekst}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 9. Newsletter */}
        <section className="bg-bez">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 lg:gap-24 items-end">
            <div data-reveal>
              <p className="eyebrow">Newsletter</p>
              <h2 className="font-serif text-[2.6rem] lg:text-6xl mt-4 leading-[1.02]">Budite <em className="text-smedja">prvi</em> koji saznaju.</h2>
              <p className="mt-5 text-sm text-tinta/70 leading-relaxed max-w-md">Nove formule, saveti za negu kože i ponude samo za pretplatnike. Bez gomile mejlova.</p>
            </div>
            <div data-reveal style={{ "--d": "150ms" }}>
              {prijavljen ? (
                <p className="font-serif text-3xl italic fade-up" role="status">Hvala! Uskoro vam se javljamo.</p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setPrijavljen(true); }} className="flex items-end gap-4 border-b border-tinta/40 focus-within:border-tinta transition-colors">
                  <label htmlFor="email" className="sr-only">Email adresa</label>
                  <input id="email" type="email" required placeholder="Vaša email adresa" className="flex-1 min-w-0 bg-transparent py-4 font-serif text-2xl lg:text-3xl outline-none placeholder:text-tinta/40" />
                  <button type="submit" className="ul pb-5 text-[0.7rem] tracking-[0.2em] uppercase font-semibold whitespace-nowrap">Prijavi se →</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer id="kontakt" className="bg-noc text-krem/70 scroll-mt-20 overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pt-20 pb-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <p className="font-serif text-2xl lg:text-3xl text-krem leading-snug max-w-xs">Ručno rađena prirodna kozmetika, <em className="text-bez">stručno formulisana.</em></p>
          {[
            ["Prodavnica", ["Lice", "Telo", "Usne i ruke", "Setovi i pokloni"]],
            ["Informacije", ["Dostava i plaćanje", "Povraćaj i reklamacije", "Uslovi korišćenja", "Politika privatnosti"]],
          ].map(([naslov, linkovi]) => (
            <div key={naslov}>
              <h3 className="eyebrow !text-bez/80">{naslov}</h3>
              <ul className="mt-6 space-y-3 text-sm">{linkovi.map((x) => <li key={x}><a href="#" className="ul hover:text-krem transition-colors">{x}</a></li>)}</ul>
            </div>
          ))}
          <div>
            <h3 className="eyebrow !text-bez/80">Kontakt</h3>
            <ul className="mt-6 space-y-3 text-sm">
              <li><a href="mailto:addition.cosmetics@gmail.com" className="ul hover:text-krem break-all">addition.cosmetics@gmail.com</a></li>
              <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="ul hover:text-krem">Instagram</a></li>
            </ul>
          </div>
        </div>
        <p className="font-serif text-krem/[0.07] text-[27vw] leading-[0.75] text-center tracking-[0.04em] select-none" aria-hidden>addition</p>
        <div className="border-t border-krem/10">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-krem/45">
            <p>© {new Date().getFullYear()} Addition Cosmetics</p>
            <p>Dizajn i izrada: Unflow</p>
          </div>
        </div>
      </footer>

      {/* Korpa koja izlazi sa desne strane */}
      <div onClick={() => setKorpaOtvorena(false)} className={`fixed inset-0 z-50 bg-noc/40 backdrop-blur-[2px] transition-opacity duration-700 ${korpaOtvorena ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-krem flex flex-col transition-transform duration-700 ease-[var(--ease)] ${korpaOtvorena ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Korpa" inert={!korpaOtvorena}
      >
        <div className="flex items-center justify-between px-6 h-16 lg:h-[76px] border-b border-bez">
          <p className="font-serif text-2xl">Korpa <span className="text-tinta/50">({brojStavki})</span></p>
          <button onClick={() => setKorpaOtvorena(false)} className="ul text-[0.68rem] tracking-[0.18em] uppercase">Zatvori</button>
        </div>
        <div className="px-6 py-5 border-b border-bez">
          <p className="text-xs text-tinta/70">
            {ukupno >= PRAG_DOSTAVE ? "Ostvarili ste besplatnu dostavu." : `Još ${rsd(PRAG_DOSTAVE - ukupno)} do besplatne dostave.`}
          </p>
          <div className="mt-3 h-[2px] bg-bez overflow-hidden">
            <div className="h-full bg-smedja origin-left transition-transform duration-700 ease-[var(--ease)]" style={{ transform: `scaleX(${Math.min(1, ukupno / PRAG_DOSTAVE)})` }} />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto px-6 divide-y divide-bez">
          {stavke.length === 0 && <li className="py-16 text-center font-serif text-2xl italic text-tinta/50">Vaša korpa je prazna.</li>}
          {stavke.map((x) => (
            <li key={x.naziv} className="py-5 flex gap-4 fade-up">
              <div className="relative w-20 h-24 shrink-0 bg-bez overflow-hidden">
                <Image src={x.slika} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="font-serif text-xl leading-tight">{x.naziv}</p>
                <p className="text-xs text-tinta/55 italic mt-1">{x.sastojak}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-tinta/20 text-sm">
                    <button onClick={() => promeni(x.naziv, -1)} className="w-8 h-8 hover:bg-bez" aria-label="Smanji količinu">−</button>
                    <span className="w-7 text-center">{x.kol}</span>
                    <button onClick={() => promeni(x.naziv, 1)} className="w-8 h-8 hover:bg-bez" aria-label="Povećaj količinu">+</button>
                  </div>
                  <p className="text-sm font-semibold">{rsd(x.kol * x.cena)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-6 border-t border-bez">
          <div className="flex justify-between text-sm mb-1"><span>Ukupno</span><span className="font-semibold">{rsd(ukupno)}</span></div>
          <p className="text-xs text-tinta/55 mb-5">Plaćanje pouzećem prilikom preuzimanja.</p>
          <a href="#" className={`btn btn-dark w-full ${stavke.length ? "" : "opacity-40 pointer-events-none"}`}>Nastavi na poručivanje <Strelica /></a>
        </div>
      </aside>
    </>
  );
}

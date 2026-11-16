import { useEffect, useRef, useState } from "react";
import "./style.css";

const catGifs = [
  "https://media1.tenor.com/m/SIAhPd8YStIAAAAd/grumpy-grumpy-cat.gif",
  "https://media1.tenor.com/m/srw_GoyVs2kAAAAd/happy-cat-dancing-cat.gif",
  "https://media.tenor.com/ECATiSXWwm8AAAAj/dancing-cat-cat.gif"
];

const catAlt = [
  "A grumpy cat giving a suspicious look",
  "A happy cat celebrating",
  "A cat dancing excitedly"
];

function playSfx(kind, enabled) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const patterns = {
      yes: [523, 659, 784, 1047],
      gift: [392, 523, 659, 784, 988, 1175],
      page: [440, 554],
      no: [330, 294]
    };
    const notes = patterns[kind] || patterns.page;
    notes.forEach((frequency, index) => {
      const start = now + index * (kind === "gift" ? 0.075 : 0.09);
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = kind === "gift" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(kind === "gift" ? 0.065 : 0.035, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "gift" ? 0.24 : 0.19));
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.26);
    });
    window.setTimeout(() => ctx.close(), 1300);
  } catch {
    // The website remains fully usable if a browser blocks audio.
  }
}

const words = {
  en: {
    toggle: "Čeština 🇨🇿", soundOn: "Sound on", soundOff: "Sound off",
    nav: "A little corner for Claudia", stamp: "A SMALL FRIENDSHIP SIDE-QUEST",
    tiny: "Made for one very specific human", title: "Well, hello, Claudia.", subtitle: "The cat has been informed. It is pretending not to care.",
    mood: "CAT'S CURRENT OPINION", moods: ["SUSPICIOUS", "MILDLY IMPRESSED", "ABSOLUTELY THRIVING"],
    q1: "First things first… are you Claudia?", yes: "Yes, that's me", no: "Wrong person",
    q2: "Do you enjoy playing Phasmophobia with Xavier?", noThanks: "I'll keep that classified",
    catLines: ["I was told there would be snacks.", "SHE'S HERE. EVERYONE STAY CALM.", "THE VIBES. THE TREATS. THE GLORY."],
    no1: "Well, this is awkward. The cat prepared its best performance for Claudia. You may still stay for a complimentary imaginary fish.",
    no2: "A fair and legally binding answer. The cat respects your honesty. Friendship side-quest paused, not judged.",
    boxKicker: "The cat saved something for you.",
    boxTitle: "The cat has been guarding something.", boxText: "Apparently it has been sitting on this present for hours. Tap the box to find out why.",
    boxHint: "OPEN THE LITTLE SURPRISE", opened: "SIDE-QUEST COMPLETE",
    letterIntro: "Three things worth saying. Straight from Xavier.",
    chapters: ["How it started", "The little things", "A proper thank-you"],
    ch1Title: "One random lobby. A very good surprise.",
    ch1: "13 November 2026 · 12:46 PM. We met in Phasmophobia, and then your Discord request turned one random lobby into a new friendship. I didn't expect anything special that day. Turns out, the best little surprises don't always come in gift boxes — sometimes they arrive with a flashlight and a questionable survival plan.",
    ch2Title: "The best part isn't the ghost hunt.",
    ch2: "It's your laugh, your voice, and how easily a quick chat becomes a whole evening. It's the silly things we say, the chaotic investigations, and checking Discord because I hope there's a message from you. Even when the ghost is being absolutely unbearable, playing with you makes it fun. You're genuinely lovely company, Claudia.",
    ch3Title: "I'm really glad our paths crossed.",
    ch3: "I'd been having a rough time, especially after losing my pets, and I didn't always know who to talk to. Then we met, completely by chance. Our conversations and Phasmophobia nights gave me something simple but important: more moments to smile. Thank you for being funny, kind, and unapologetically yourself. You don't have to fix anything or be online all the time. I'm not asking for anything — I just wanted you to know that this friendship means a lot to me. Here's to more laughs, more ridiculous ghost hunts, and many more good memories. — Xavier",
    noteLabels: ["THE FIRST HELLO", "WHY I LIKE OUR TIME", "JUST A THANK-YOU"],
    back: "← Previous", next: "Next chapter →", restart: "Start the surprise again",
    end: "Made with friendship by Xavier · no jumpscares, promise.",
    burst: "THE CAT HAS LOST ALL COMPOSURE",
    tapHint: "Tap once. The cat has trust issues, not a mouse requirement."
  },
  cz: {
    toggle: "English 🇬🇧", soundOn: "Zvuk zapnutý", soundOff: "Zvuk vypnutý",
    nav: "Malý koutek pro Claudii", stamp: "MALÁ PŘÁTELSKÁ VEDLEJŠÍ MISE",
    tiny: "Vytvořeno pro jednu konkrétní osobu", title: "Ahoj, Claudio.", subtitle: "Kočka o tobě ví. Jen předstírá, že ji to nezajímá.",
    mood: "CO SI KOČKA PRÁVĚ MYSLÍ", moods: ["PODEZÍRAVÁ", "DOCELA SPOKOJENÁ", "NAPROSTO NADŠENÁ"],
    q1: "Nejdřív to hlavní… jsi Claudia?", yes: "Ano, to jsem já", no: "Špatná osoba",
    q2: "Baví tě hrát Phasmophobii s Xavierem?", noThanks: "To zůstane tajemstvím",
    catLines: ["Doufám, že budou pamlsky.", "JE TADY. VŠICHNI KLID.", "TA ATMOSFÉRA. PAMLSKY. SLÁVA."],
    no1: "Tak to je trochu trapas. Kočka si připravila nejlepší vystoupení pro Claudii. Ale můžeš zůstat na jednu imaginární rybičku.",
    no2: "Fér a právně závazná odpověď. Kočka oceňuje upřímnost. Přátelská mise se pozastavuje, žádné soudy.",
    boxKicker: "Kočka pro tebe něco schovala.",
    boxTitle: "Kočka něco celou dobu hlídá.", boxText: "Prý na tom dárku sedí už několik hodin. Klepni na krabičku a zjisti proč.",
    boxHint: "OTEVŘÍT MALÉ PŘEKVAPENÍ", opened: "VEDLEJŠÍ MISE DOKONČENA",
    letterIntro: "Tři věci, které stojí za to říct. Od Xaviera.",
    chapters: ["Jak to začalo", "Malé věci", "Upřímné díky"],
    ch1Title: "Jedna náhodná hra. Moc milé překvapení.",
    ch1: "13. listopadu 2026 · 12:46. Potkali jsme se ve Phasmophobii a tvoje žádost na Discordu proměnila náhodnou hru v nové přátelství. Ten den jsem nic zvláštního nečekal. Ukázalo se, že ta nejlepší překvapení někdy nepřijdou v krabičce — ale s baterkou a dost pochybným plánem na přežití.",
    ch2Title: "Nejlepší na tom nejsou duchové.",
    ch2: "Je to tvůj smích, tvůj hlas a to, jak se krátký rozhovor snadno protáhne na celý večer. Jsou to naše hlášky, chaotická vyšetřování a kontrolování Discordu, jestli od tebe nepřišla zpráva. I když se duch chová naprosto příšerně, s tebou je to zábava. Je s tebou opravdu příjemně, Claudio.",
    ch3Title: "Jsem moc rád, že jsme se potkali.",
    ch3: "Procházel jsem těžším obdobím, hlavně po ztrátě svých mazlíčků, a někdy jsem nevěděl, s kým si promluvit. A pak jsme se úplnou náhodou potkali. Naše rozhovory a večery s Phasmophobií mi přinesly něco jednoduchého, ale důležitého: víc důvodů k úsměvu. Děkuju, že jsi vtipná, milá a svá. Nemusíš nic napravovat ani být pořád online. Nic za to nečekám — jen jsem chtěl, abys věděla, že si našeho přátelství opravdu vážím. Ať nás čeká ještě spousta smíchu, bláznivých lovů duchů a hezkých vzpomínek. — Xavier",
    noteLabels: ["PRVNÍ AHOJ", "PROČ MĚ TO S TEBOU BAVÍ", "PROSTÉ PODĚKOVÁNÍ"],
    back: "← Zpět", next: "Další kapitola →", restart: "Spustit překvapení znovu",
    end: "S přátelstvím vytvořil Xavier · žádné lekačky, slibuju.",
    burst: "KOČKA ZTRATILA VEŠKEROU DŮSTOJNOST",
    tapHint: "Stačí jedno klepnutí. Kočka má problém s důvěrou, ne s myší."
  }
};

export default function App() {
  const [lang, setLang] = useState("cz");
  const [stage, setStage] = useState(0);
  const [mood, setMood] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [blastActive, setBlastActive] = useState(false);
  const blastTimer = useRef(null);
  const t = words[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "cz" ? "cs" : "en";
    return () => window.clearTimeout(blastTimer.current);
  }, [lang]);

  const acceptName = () => {
    playSfx("yes", soundOn);
    setMood(1);
    setStage(1);
  };
  const acceptGame = () => {
    playSfx("yes", soundOn);
    setMood(2);
    setStage(2);
  };
  const openBox = () => {
    if (stage !== 2) return;
    playSfx("gift", soundOn);
    setStage(3);
    setBlastActive(true);
    window.clearTimeout(blastTimer.current);
    blastTimer.current = window.setTimeout(() => setBlastActive(false), 1850);
  };
  const restart = () => {
    playSfx("page", soundOn);
    setStage(0);
    setMood(0);
    setChapter(0);
    setBlastActive(false);
  };
  const setPage = (page) => {
    playSfx("page", soundOn);
    setChapter(page);
  };
  const toggleLanguage = () => {
    playSfx("page", soundOn);
    setLang(current => current === "en" ? "cz" : "en");
  };

  const chapterTitle = [t.ch1Title, t.ch2Title, t.ch3Title][chapter];
  const chapterBody = [t.ch1, t.ch2, t.ch3][chapter];
  const progress = stage === 0 ? 20 : stage === 1 ? 42 : stage === 2 ? 68 : stage === 3 ? 100 : 0;

  return (
    <main className="site-shell">
      {blastActive && (
        <div className="gift-burst" aria-hidden="true">
          {Array.from({ length: 46 }, (_, index) => (
            <span key={index} style={{
              "--dx": `${Math.cos((Math.PI * 2 * index) / 46) * (120 + (index % 6) * 30)}px`,
              "--dy": `${Math.sin((Math.PI * 2 * index) / 46) * (120 + (index % 6) * 30)}px`,
              "--delay": `${(index % 7) * 14}ms`,
              "--size": `${13 + (index % 5) * 5}px`
            }}>♥</span>
          ))}
        </div>
      )}

      <header className="nav">
        <a className="nav-brand" href="#top" aria-label="Back to top">
          <span className="brand-mark">c.</span>
          <span>{t.nav}</span>
        </a>
        <div className="nav-actions">
          <button className="sound-btn" onClick={() => setSoundOn(value => !value)} aria-pressed={soundOn}>
            <span className="button-icon">♫</span>{soundOn ? t.soundOn : t.soundOff}
          </button>
          <button className="lang-btn" onClick={toggleLanguage}>{t.toggle}</button>
        </div>
      </header>

      <section className="main-card" id="top">
        <div className="intro-block">
          <p className="eyebrow">{t.tiny}</p>
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>

        <div className="experience-grid">
          <aside className="cat-column">
            <figure className={`cat-reaction mood-${mood}`}>
              <div className="cat-frame">
                <img
                  key={mood}
                  src={catGifs[mood]}
                  alt={catAlt[mood]}
                  loading="eager"
                  onError={event => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = catGifs[1];
                  }}
                />
                <span className="cat-corner cat-corner-a">✦</span>
                <span className="cat-corner cat-corner-b">✦</span>
              </div>
              <figcaption>{t.catLines[mood]}</figcaption>
            </figure>
          </aside>

          <section className="interaction-column" aria-live="polite">
            {stage === 0 && (
              <div className="question-panel animate-in" key="question-one">
                <h2>{t.q1}</h2>
                <p className="panel-note">The cat has reviewed the guest list. It remains unconvinced.</p>
                <div className="actions">
                  <button className="primary-btn" onClick={acceptName}>{t.yes}<span>↗</span></button>
                  <button className="quiet-btn" onClick={() => { playSfx("no", soundOn); setStage(4); }}>{t.no}</button>
                </div>
              </div>
            )}

            {stage === 1 && (
              <div className="question-panel animate-in" key="question-two">
                <h2>{t.q2}</h2>
                <p className="panel-note">Be honest. The cat has already picked a favourite teammate.</p>
                <div className="actions">
                  <button className="primary-btn" onClick={acceptGame}>{t.yes}<span>↗</span></button>
                  <button className="quiet-btn" onClick={() => { playSfx("no", soundOn); setStage(5); }}>{t.noThanks}</button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="box-panel animate-in">
                <p className="box-kicker">{t.boxKicker}</p>
                <h2>{t.boxTitle}</h2>
                <p>{t.boxText}</p>
                <button className="mystery-box" onClick={openBox} aria-label={t.boxHint}>
                  <span className="box-back" />
                  <span className="box-emoji">🎁</span>
                  <span className="box-lid" />
                  <span className="box-spark spark-one">✦</span>
                  <span className="box-spark spark-two">✧</span>
                </button>
                <span className="box-hint">{t.boxHint}</span>
                <p className="tap-hint">{t.tapHint}</p>
              </div>
            )}

            {stage === 3 && (
              <div className="letter-panel animate-in">
                <p className="box-kicker">{t.opened}</p>
                <h2>{t.letterIntro}</h2>
                <div className="chapter-tabs" role="tablist" aria-label="Letter chapters">
                  {t.chapters.map((label, index) => (
                    <button
                      key={label}
                      role="tab"
                      aria-selected={chapter === index}
                      className={chapter === index ? "active" : ""}
                      onClick={() => setPage(index)}
                    >
                      <span className="tab-number">0{index + 1}</span>
                      <span className="tab-label">{label}</span>
                    </button>
                  ))}
                </div>
                <article className="letter-paper" key={chapter}>
                  <div className="paper-top">
                    <span>{t.noteLabels[chapter]}</span>
                    <span>0{chapter + 1} / 03</span>
                  </div>
                  <div className="paper-rule" />
                  <h3>{chapterTitle}</h3>
                  <p className="letter-text">{chapterBody}</p>
                  <div className="paper-sign">— Xavier <span>✦</span></div>
                </article>
                <div className="letter-controls">
                  <button className="quiet-btn" disabled={chapter === 0} onClick={() => setPage(chapter - 1)}>{t.back}</button>
                  {chapter < 2
                    ? <button className="primary-btn" onClick={() => setPage(chapter + 1)}>{t.next}<span>↗</span></button>
                    : <button className="primary-btn" onClick={restart}>{t.restart}<span>↻</span></button>}
                </div>
              </div>
            )}

            {stage === 4 && (
              <div className="question-panel animate-in">
                <h2>{t.no1}</h2>
                <button className="quiet-btn" onClick={restart}>{t.restart}</button>
              </div>
            )}
            {stage === 5 && (
              <div className="question-panel animate-in">
                <h2>{t.no2}</h2>
                <button className="quiet-btn" onClick={restart}>{t.restart}</button>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer>{t.end}</footer>
    </main>
  );
}

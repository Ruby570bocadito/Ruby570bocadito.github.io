import ClickSpark from './reactbits/ClickSpark.jsx';
import Contact from './components/Contact.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Library from './components/Library.jsx';
import { PeriCompanion, PeriProvider, PeriSprite } from './components/Peri.jsx';
import { About, Certs, Events, Featured, Marquee, Projects, Skills } from './components/Sections.jsx';
import { LangProvider, useT } from './i18n.jsx';

function Page() {
  const { t } = useT();
  return (
    <PeriProvider>
      <ClickSpark sparkColor={['#4E5E80', '#FFB37A', '#7CC242']} sparkCount={9} sparkRadius={26} sparkSize={11} duration={520}>
        <a className="skip" href="#proyectos">{t('skip')}</a>
        <Header />
        <main>
          <Hero />
          <section className="section section-alt" id="proyectos">
            <Featured />
            <Projects />
          </section>
          <Marquee />
          <Events />
          <Skills />
          <Certs />
          <Library />
          <About />
          <Contact />
        </main>
        <footer className="footer">
          <div className="wrap footer-row">
            <PeriSprite decorative idle="wave" pose="wave1" className="footer-peri" />
            <div>
              <p>{t('footer.made')}</p>
              <p>© 2026 Rafael Gálvez Silipo · Málaga</p>
            </div>
          </div>
        </footer>
      </ClickSpark>
      <PeriCompanion />
    </PeriProvider>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}

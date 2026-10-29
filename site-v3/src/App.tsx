import { MotionConfig } from 'framer-motion';
import { FloatingNav } from './components/FloatingNav';
import { RiveProvider } from './components/RiveKit';
import { ui } from './content';
import { LangProvider, useLang } from './i18n';
import { About } from './sections/About';
import { Areas } from './sections/Areas';
import { Contact } from './sections/Contact';
import { Hackathons } from './sections/Hackathons';
import { Hero } from './sections/Hero';
import { Marquee } from './sections/Marquee';
import { Objective } from './sections/Objective';
import { Projects } from './sections/Projects';
import { Robotics } from './sections/Robotics';
import { StackBand } from './sections/StackBand';
import { Training } from './sections/Training';

function Page() {
  const { t } = useLang();
  return (
    <div className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <a href="#about" className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t(ui.skip)}
      </a>
      <FloatingNav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Areas />
        <Projects />
        <StackBand />
        <Training />
        <Hackathons />
        <Robotics />
        <Objective />
        <Contact />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <RiveProvider>
          <Page />
        </RiveProvider>
      </MotionConfig>
    </LangProvider>
  );
}

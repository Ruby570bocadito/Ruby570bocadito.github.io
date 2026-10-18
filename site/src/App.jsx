import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles.css';

import { LangProvider } from './lang.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import {
  About, Achievement, Certs, Education, Labs, Learn, Marquee, Now, Projects, Skills, Stats, WhatIDo
} from './components/Sections.jsx';
import { Contact, Footer } from './components/Contact.jsx';

export default function App({ initialLang = 'en' }) {
  return (
    <LangProvider initial={initialLang}>
      <div id="sprog" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <WhatIDo />
        <Stats />
        <Projects />
        <Learn />
        <Skills />
        <Certs />
        <Labs />
        <Achievement />
        <Education />
        <Now />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  );
}

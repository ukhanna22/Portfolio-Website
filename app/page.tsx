import { ViewTransition } from "react";
import { Hero } from "@/components/sections/hero/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/experience/Experience";
import { Work } from "@/components/sections/work/Work";
import { Research } from "@/components/sections/Research";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";
import { Preloader } from "@/components/effects/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <ViewTransition
        enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        default="none"
      >
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Work />
          <Research />
          <Skills />
          <Education />
          <Beyond />
          <Contact />
        </main>
      </ViewTransition>
    </>
  );
}

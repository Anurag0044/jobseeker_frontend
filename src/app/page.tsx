import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background dark:bg-background border-b border-outline-variant/30 flex justify-between items-center px-lg py-md max-w-[1440px] mx-auto">
        <div className="font-display-xl text-headline-lg-mobile tracking-tighter text-on-surface dark:text-on-surface">
          ForgeX
        </div>
        <div className="hidden md:flex gap-lg items-center">
          <Link
            className="text-secondary dark:text-secondary hover:text-primary transition-colors duration-200 font-body-lg text-body-lg"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-secondary dark:text-secondary hover:text-primary transition-colors duration-200 font-body-lg text-body-lg"
            href="#"
          >
            Agents
          </Link>
          <Link
            className="text-secondary dark:text-secondary hover:text-primary transition-colors duration-200 font-body-lg text-body-lg"
            href="#"
          >
            Pricing
          </Link>
        </div>
        <Link
          href="/sign-in"
          className="bg-primary text-background h-[40px] px-lg rounded font-label-caps text-label-caps tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center"
        >
          Get Started
        </Link>
      </nav>

      <section className="relative pt-xxl pb-xl px-md md:px-lg max-w-[1440px] mx-auto flex flex-col items-center text-center mt-xl">
        <div className="inline-flex items-center gap-xs px-md py-xs rounded level-1 mb-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-mono-label text-mono-label text-on-surface-variant uppercase tracking-widest">
            Engine Active
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-xl md:text-display-xl text-on-surface max-w-[56rem] tracking-tighter mb-lg leading-tight">
          Forge Applications.
          <br />
          <span className="text-on-surface-variant">Not Documents.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-[42rem] mb-xl">
          Multi-agent AI that transforms resumes into tailored applications, ATS-optimized
          resumes, personalized cover letters, and interview-ready insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-md mb-xxl">
          <Link
            href="/workspace"
            className="bg-primary text-background h-[40px] px-xl rounded font-label-caps text-label-caps tracking-widest relative overflow-hidden group flex items-center justify-center"
          >
            <span className="relative z-10">Start Forging</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <button className="level-1 text-on-surface h-[40px] px-xl rounded font-label-caps text-label-caps tracking-widest hover:bg-[#1A1A1A] transition-colors duration-300">
            View Demo
          </button>
        </div>

        <div className="w-full max-w-[64rem] level-1 rounded-xl overflow-hidden relative shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <div className="h-10 bg-surface flex items-center px-md border-b border-outline-variant/20 gap-2">
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
            <div className="w-3 h-3 rounded-full bg-outline-variant/40"></div>
            <div className="ml-auto font-mono-label text-mono-label text-outline-variant">
              workspace.forge
            </div>
          </div>
          <div className="p-lg grid grid-cols-1 md:grid-cols-4 gap-md bg-background min-h-[400px]">
            <div className="col-span-1 hidden md:flex flex-col gap-sm border-r border-outline-variant/20 pr-md">
              <div className="font-label-caps text-label-caps text-secondary mb-sm">Agents</div>
              <div className="flex items-center gap-sm p-sm rounded bg-surface-container border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-[16px]">
                  analytics
                </span>
                <span className="font-mono-label text-mono-label text-on-surface">Job Analyzer</span>
              </div>
              <div className="flex items-center gap-sm p-sm rounded bg-surface border border-outline-variant/10 opacity-60">
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  edit_document
                </span>
                <span className="font-mono-label text-mono-label text-secondary">Resume Opt</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <div className="flex gap-sm items-center">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                  <div className="font-mono-label text-mono-label text-secondary truncate w-48">
                    https://jobs.apple.com/engineer...
                  </div>
                </div>
                <div className="flex items-center gap-sm border border-primary/30 bg-primary/10 px-sm py-xs rounded">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-mono-label text-mono-label text-primary">ATS Score: 92%</span>
                </div>
              </div>

              <div className="flex-1 level-1 rounded p-md relative overflow-hidden flex flex-col gap-sm">
                <div className="font-mono-label text-mono-label text-outline-variant mb-md">
                  // Compiling targeted artifacts...
                </div>
                <div className="flex gap-md items-start">
                  <div className="w-8 font-mono-label text-mono-label text-outline-variant/50 text-right">
                    01
                  </div>
                  <div className="h-2 bg-surface-container w-3/4 rounded mt-1"></div>
                </div>
                <div className="flex gap-md items-start">
                  <div className="w-8 font-mono-label text-mono-label text-outline-variant/50 text-right">
                    02
                  </div>
                  <div className="h-2 bg-surface-container w-full rounded mt-1"></div>
                </div>
                <div className="flex gap-md items-start">
                  <div className="w-8 font-mono-label text-mono-label text-outline-variant/50 text-right">
                    03
                  </div>
                  <div className="h-2 bg-surface-container w-5/6 rounded mt-1"></div>
                </div>
                <div className="flex gap-md items-start mt-lg">
                  <div className="w-8 font-mono-label text-mono-label text-primary text-right">
                    04
                  </div>
                  <div className="h-2 bg-primary/20 w-1/2 rounded mt-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary w-1/2 rounded"></div>
                  </div>
                </div>
                <div className="absolute left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_10px_rgba(194,193,255,0.8)] animate-scan blur-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xxl px-md md:px-lg max-w-[1440px] mx-auto">
        <div className="text-center mb-xl">
          <h2 className="font-title-md text-title-md text-on-surface mb-sm">
            Orchestrated Intelligence
          </h2>
          <p className="font-body-sm text-body-sm text-secondary">
            Four specialized agents working in unison.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/20 -z-10 translate-y-[-50%]"></div>

          <div className="level-1 p-lg rounded flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-md group-hover:border-primary/50 transition-colors duration-300">
              <span className="material-symbols-outlined text-primary">search</span>
            </div>
            <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
              Job Analysis
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">Deconstructs requirements.</p>
          </div>

          <div className="level-1 p-lg rounded flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-md group-hover:border-primary/50 transition-colors duration-300">
              <span className="material-symbols-outlined text-primary">edit_document</span>
            </div>
            <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
              Resume Opt
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">Rebuilds structural match.</p>
          </div>

          <div className="level-1 p-lg rounded flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-md group-hover:border-primary/50 transition-colors duration-300">
              <span className="material-symbols-outlined text-primary">mail</span>
            </div>
            <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
              Cover Letter
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Generates narrative alignment.
            </p>
          </div>

          <div className="level-1 p-lg rounded flex flex-col items-center text-center relative group">
            <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-md group-hover:border-primary/50 transition-colors duration-300">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
              Assembly
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">Packages final artifacts.</p>
          </div>
        </div>
      </section>

      <section className="py-xxl px-md md:px-lg max-w-[1440px] mx-auto">
        <h2 className="font-title-md text-title-md text-on-surface mb-lg">Output Artifacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md auto-rows-[250px]">
          <div className="md:col-span-2 level-1 rounded p-lg relative overflow-hidden flex flex-col justify-between">
            <div className="z-10">
              <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
                ATS Optimization Report
              </h3>
              <p className="font-body-sm text-body-sm text-secondary max-w-[24rem]">
                Keyword density mapping and structural parsing analysis against the target job
                description.
              </p>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] opacity-20">
              <div className="w-full h-full border border-primary rounded-full absolute top-0 left-0 scale-110"></div>
              <div className="w-full h-full border border-primary rounded-full absolute top-10 left-10 scale-90"></div>
              <div className="w-full h-full border border-primary rounded-full absolute top-20 left-20 scale-75"></div>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-2 level-1 rounded p-lg relative overflow-hidden group">
            <div className="z-10 relative">
              <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
                Tailored Resume
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">Dynamically restructured.</p>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen transition-opacity duration-500 group-hover:opacity-50"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1pUkifzAVdqSqUnGwmbnlEW-8gE_0M5ByYi5-Bs1r9JIYne-8i88b1zaCh9pblYQDwTr-QwMHuYmJg4FA2kOO-o3Jv__AzL8hoQnBZ8IARC-tgD4AInLqAN3Ez8Mf3KTqrqGyT2UC_YAUOY7TEj7Ree83Sf2mnLKpT_Wxh4tyvxgNszGx-42Tz74nqe5f6lmTevNEUVOegW0s9z8gmaFTd0ai5dBLq92RAI_ZB24HKRbHvBXqNHUz-dZA2IZC6ETcLfXvLT5FoV8')",
              }}
            ></div>
          </div>

          <div className="md:col-span-1 level-1 rounded p-lg relative overflow-hidden">
            <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
              Cover Letter
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Narrative alignment based on selected tone vectors.
            </p>
            <div className="mt-md flex flex-col gap-2 opacity-50">
              <div className="h-1 bg-surface-container-high w-full rounded"></div>
              <div className="h-1 bg-surface-container-high w-5/6 rounded"></div>
              <div className="h-1 bg-surface-container-high w-4/6 rounded"></div>
            </div>
          </div>

          <div className="md:col-span-1 level-1 rounded p-lg relative overflow-hidden group">
            <div className="z-10 relative">
              <h3 className="font-mono-label text-mono-label text-on-surface uppercase tracking-widest mb-xs">
                Interview Prep
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">Generated talking points.</p>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen transition-opacity duration-500 group-hover:opacity-50"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKWyS_su9HfkPVV6aEKSUOzJ-2S9iVPZtn5xzH0nRkiGiu3rCVZPwxzc2Kg8C9fwBgjvhMfx2_yKaO18u_x1jeFJGgYQhhJB2HXI7TxNNDGeB7OeKvTJzZN6kglmxqI4H-kNJbtdrA7QleVk6khbht3mF_EyMq_Z7d5CC9-wbafG8AA8Zv4pHh9Px2l_FM9roOlEmn0H0Mgscd-c1yu9rghrYz1azV6GrgNmvU19n_rshH1AqjF0Ayig1CFPqz6BG7TgzgdKnEU6k')",
              }}
            ></div>
          </div>
        </div>
      </section>

      <section className="py-xxl px-md md:px-lg max-w-[1440px] mx-auto mb-xxl">
        <div className="text-center mb-xl">
          <h2 className="font-title-md text-title-md text-on-surface">Compute Allocation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md max-w-[56rem] mx-auto">
          <div className="level-1 p-lg rounded flex flex-col">
            <div className="font-mono-label text-mono-label text-secondary uppercase tracking-widest mb-sm">
              Basic
            </div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-lg">
              $29<span className="font-body-sm text-body-sm text-secondary">/mo</span>
            </div>
            <div className="h-[1px] w-full bg-outline-variant/20 mb-lg"></div>
            <ul className="flex flex-col gap-sm mb-xl flex-1">
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check</span>{" "}
                10 Generations/mo
              </li>
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check</span>{" "}
                Standard Agents
              </li>
            </ul>
            <button className="w-full level-1 text-on-surface h-[40px] rounded font-label-caps text-label-caps tracking-widest hover:bg-[#1A1A1A] transition-colors">
              Select Basic
            </button>
          </div>

          <div className="level-1 border-primary/50 p-lg rounded flex flex-col relative shadow-[0_0_30px_rgba(194,193,255,0.05)]">
            <div className="absolute top-0 right-md bg-primary text-background px-xs py-[2px] rounded-b font-label-caps text-[10px] tracking-widest">
              RECOMMENDED
            </div>
            <div className="font-mono-label text-mono-label text-primary uppercase tracking-widest mb-sm">
              Pro
            </div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-lg">
              $79<span className="font-body-sm text-body-sm text-secondary">/mo</span>
            </div>
            <div className="h-[1px] w-full bg-outline-variant/20 mb-lg"></div>
            <ul className="flex flex-col gap-sm mb-xl flex-1">
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">check</span> 50
                Generations/mo
              </li>
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">check</span>{" "}
                Premium Agents
              </li>
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">check</span>{" "}
                Custom Vectors
              </li>
            </ul>
            <button className="w-full bg-primary text-background h-[40px] rounded font-label-caps text-label-caps tracking-widest hover:opacity-90 transition-opacity">
              Select Pro
            </button>
          </div>

          <div className="level-1 p-lg rounded flex flex-col">
            <div className="font-mono-label text-mono-label text-secondary uppercase tracking-widest mb-sm">
              Enterprise
            </div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-lg">
              Custom
            </div>
            <div className="h-[1px] w-full bg-outline-variant/20 mb-lg"></div>
            <ul className="flex flex-col gap-sm mb-xl flex-1">
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check</span>{" "}
                Unlimited Generations
              </li>
              <li className="flex items-center gap-sm font-body-sm text-body-sm text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check</span>{" "}
                Dedicated Orchestrator
              </li>
            </ul>
            <button className="w-full level-1 text-on-surface h-[40px] rounded font-label-caps text-label-caps tracking-widest hover:bg-[#1A1A1A] transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-background dark:bg-background border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center px-xl py-lg w-full max-w-[1440px] mx-auto mt-xxl">
        <div className="font-title-md text-title-md text-on-surface mb-md md:mb-0">
          © 2024 ForgeX. Built for the future of work.
        </div>
        <div className="flex gap-md">
          <Link className="text-secondary hover:text-primary transition-colors font-body-sm text-body-sm" href="#">
            Privacy
          </Link>
          <Link className="text-secondary hover:text-primary transition-colors font-body-sm text-body-sm" href="#">
            Terms
          </Link>
          <Link className="text-secondary hover:text-primary transition-colors font-body-sm text-body-sm" href="#">
            Security
          </Link>
          <Link className="text-secondary hover:text-primary transition-colors font-body-sm text-body-sm" href="#">
            Changelog
          </Link>
        </div>
      </footer>
    </>
  );
}

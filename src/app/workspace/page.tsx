import React from "react";
import Link from "next/link";

export default function WorkspacePage() {
  return (
    <div className="h-screen w-full flex overflow-hidden font-body-lg text-body-lg antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .substrate-panel {
            background-color: #121212;
            border: 1px solid #262626;
        }
        .hairline-border-b { border-bottom: 1px solid #262626; }
        .hairline-border-r { border-right: 1px solid #262626; }
        .pulse-dot {
            width: 6px;
            height: 6px;
            background-color: #5e5ce6; 
            border-radius: 50%;
            box-shadow: 0 0 8px 2px rgba(94, 92, 230, 0.5);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(94, 92, 230, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(94, 92, 230, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(94, 92, 230, 0); }
        }
        .glass-button {
            border: 1px solid #262626;
            background-color: transparent;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .glass-button:hover {
            background-color: #1A1A1A;
        }
        .primary-button {
            background-color: #4d4ad5; 
            color: #ffffff;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }
        .primary-button::after {
            content: '';
            position: absolute;
            inset: 0;
            background-color: rgba(255,255,255,0.1);
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        .primary-button:hover::after {
            opacity: 1;
        }
        .chat-input-focus:focus-within {
            border-color: #4d4ad5;
            box-shadow: 0 0 0 2px rgba(77, 74, 213, 0.2);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #484949; }
      `}} />

      {/* SideNavBar */}
      <nav className="h-screen w-64 left-0 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-lg px-md z-10 shrink-0">
        <div className="mb-xl px-sm flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2y3pB_JwPAbZTNF09m4ruAQ1gwdeXmA3UeijQVLC-MsZMpgWPvs30mPN_CiFmLlfcM9zlwACPS__-kaB2bzwh60Dk27ZY_fsK2xMgBYb3xnqi022gLVoEUbDKOco5aECmyqpB7UQClL4CCAi5jNWaKl1Kaw8Ku25MrLK-lcX5cHksCanynCQxV2eqlLUF6hKq1UOfNrk50Tox7GJ9ixuIz-hLQaUZtePv4ZediryYXpOLY8V6jaXTejUmOt05vHl89E8MYdYIFYU"
              alt="Avatar"
            />
          </div>
          <div>
            <h1 className="font-headline-lg text-title-md text-primary tracking-tight">Workspace</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">Executive Suite</p>
          </div>
        </div>

        <div className="mb-xl px-sm">
          <button className="w-full flex items-center justify-center gap-sm h-10 rounded-lg primary-button font-label-caps text-label-caps tracking-widest uppercase border-none">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Agent
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-unit">
          <Link href="/" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group">
            <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="#" className="flex items-center gap-md px-md py-sm rounded-lg text-primary bg-secondary-container/10 border-r-2 border-primary scale-[0.98] font-mono-label text-mono-label uppercase tracking-widest relative">
            <span className="material-symbols-outlined text-[18px]">work</span>
            <span>Applications</span>
          </Link>
          <Link href="#" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group">
            <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">inventory_2</span>
            <span>Artifacts</span>
          </Link>
          <Link href="#" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group">
            <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">settings</span>
            <span>Settings</span>
          </Link>
        </div>

        <div className="flex flex-col gap-unit pt-md border-t border-outline-variant/20 mt-auto">
          <Link href="#" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group">
            <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">help</span>
            <span>Help</span>
          </Link>
          <Link href="/sign-in" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group">
            <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">logout</span>
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Center Workspace */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden substrate-panel mx-lg my-lg rounded-xl">
        <header className="h-16 flex items-center px-xl hairline-border-b shrink-0 bg-[#0A0A0A]">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            <h2 className="font-title-md text-title-md text-on-surface">Application Orchestration Flow</h2>
            <span className="px-sm py-xs bg-[#1A1A1A] rounded text-[10px] font-mono-label uppercase tracking-widest text-on-surface-variant ml-md">Session #A49-B2</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-xl flex flex-col gap-xl">
          <div className="flex flex-col gap-md max-w-[48rem]">
            <div className="flex items-center gap-sm text-on-surface-variant">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-[#262626]">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <span className="font-mono-label text-mono-label uppercase tracking-widest">User Execution Request</span>
            </div>
            <div className="ml-10 p-md rounded-lg bg-[#0A0A0A] border border-[#262626] font-body-sm text-on-surface text-body-sm">
              Initiate full application pipeline for the Senior UX Engineer role at Apple. Use my latest master resume.
            </div>
            <div className="ml-10 flex gap-md flex-wrap">
              <div className="flex items-center gap-sm p-sm pr-md rounded-md bg-[#121212] border border-[#262626] glass-button cursor-pointer">
                <div className="w-8 h-8 bg-[#1A1A1A] rounded flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error text-[18px]">picture_as_pdf</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-[13px] text-on-surface leading-tight">Master_Resume_2024.pdf</span>
                  <span className="font-mono-label text-[10px] text-on-surface-variant uppercase">Local File • 1.2MB</span>
                </div>
              </div>
              <div className="flex items-center gap-sm p-sm pr-md rounded-md bg-[#121212] border border-[#262626] glass-button cursor-pointer">
                <div className="w-8 h-8 bg-[#1A1A1A] rounded flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">link</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-[13px] text-on-surface leading-tight truncate max-w-[180px]">jobs.apple.com/careers/ux-sr</span>
                  <span className="font-mono-label text-[10px] text-on-surface-variant uppercase">External Context • Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-md max-w-[48rem] mt-lg">
            <div className="flex items-center gap-sm text-primary">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 relative">
                <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                  <div className="pulse-dot w-1.5 h-1.5"></div>
                </div>
              </div>
              <span className="font-mono-label text-mono-label uppercase tracking-widest flex items-center gap-2">
                ForgeX Orchestrator
                <span className="text-[10px] text-on-surface-variant bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#262626]">Compiling</span>
              </span>
            </div>
            <div className="ml-10 font-body-sm text-on-surface-variant text-body-sm leading-relaxed">
              Pipeline initiated. Artifact generation is in progress. The Job Analysis and ATS Optimization agents have completed their cycles. The Cover Letter Agent is currently drafting customized copy based on the parsed requirements.
            </div>
          </div>
        </div>

        <div className="p-lg shrink-0 hairline-border-t bg-[#0A0A0A]">
          <div className="max-w-[56rem] mx-auto relative rounded-lg bg-[#0A0A0A] border border-[#262626] chat-input-focus transition-all duration-200 p-2 flex items-end gap-2">
            <button className="w-8 h-8 rounded hover:bg-[#1A1A1A] flex items-center justify-center text-on-surface-variant transition-colors shrink-0 border-none">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-body-sm font-body-sm text-on-surface resize-none max-h-32 min-h-[40px] py-2 placeholder-[#555555] outline-none"
              placeholder="Instruct agents or provide additional context..."
              rows={1}
            ></textarea>
            <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
              <button className="h-8 px-3 rounded bg-[#1A1A1A] hover:bg-[#262626] text-on-surface-variant flex items-center justify-center border border-[#262626] transition-colors font-mono-label text-[11px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] mr-1">mic</span> Voice
              </button>
              <button className="w-8 h-8 rounded primary-button flex items-center justify-center shadow-none border-none">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
            <span className="font-mono-label text-[10px] text-[#555555] uppercase tracking-widest">ForgeX OS Version 2.1.0 • Secure Session</span>
          </div>
        </div>
      </main>

      {/* Right Panel: Agent Activity & Artifacts */}
      <aside className="w-80 h-full flex flex-col shrink-0 border-l border-[#262626] bg-[#0A0A0A] z-10">
        <header className="h-16 flex items-center px-lg hairline-border-b shrink-0 justify-between">
          <h3 className="font-mono-label text-mono-label uppercase tracking-widest text-on-surface-variant">Live Telemetry</h3>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">tune</span>
        </header>
        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-xxl">
          <section>
            <div className="flex items-center justify-between mb-md">
              <h4 className="font-title-md text-[14px] text-on-surface">Orchestration Status</h4>
              <span className="text-[10px] font-mono-label bg-primary-container/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">75%</span>
            </div>
            <div className="flex flex-col gap-1 border border-[#262626] rounded-lg bg-[#121212] overflow-hidden">
              <div className="flex items-center gap-md p-md bg-[rgba(255,255,255,0.02)] hairline-border-b">
                <span className="material-symbols-outlined text-[#a3e635] text-[18px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-sm text-[13px] text-on-surface">Job Analysis</span>
                  <span className="font-mono-label text-[10px] text-on-surface-variant">0.4s • Parsed 12 entities</span>
                </div>
              </div>
              <div className="flex items-center gap-md p-md bg-[rgba(255,255,255,0.02)] hairline-border-b">
                <span className="material-symbols-outlined text-[#a3e635] text-[18px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-sm text-[13px] text-on-surface">ATS Optimization</span>
                  <span className="font-mono-label text-[10px] text-on-surface-variant">1.2s • Matched 94% keywords</span>
                </div>
              </div>
              <div className="flex items-center gap-md p-md relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="w-[18px] h-[18px] flex items-center justify-center relative shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px] absolute opacity-30">autorenew</span>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col relative z-10 ml-2">
                  <span className="font-body-sm text-[13px] text-primary font-medium">Cover Letter Generation</span>
                  <span className="font-mono-label text-[10px] text-primary/70">Drafting paragraph 3...</span>
                </div>
              </div>
              <div className="flex items-center gap-md p-md hairline-border-t bg-[#0A0A0A]">
                <span className="material-symbols-outlined text-[#555555] text-[18px]">radio_button_unchecked</span>
                <div className="flex flex-col opacity-50 ml-2">
                  <span className="font-body-sm text-[13px] text-on-surface">Interview Prep</span>
                  <span className="font-mono-label text-[10px] text-on-surface-variant">Awaiting trigger</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-md">
              <h4 className="font-title-md text-[14px] text-on-surface">Compiled Artifacts</h4>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">folder_special</span>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="group p-md rounded-lg bg-[#121212] border border-[#262626] transition-colors hover:border-[#484949]">
                <div className="flex items-start justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-6 h-6 bg-[#1A1A1A] rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">analytics</span>
                    </div>
                    <span className="font-body-sm text-[13px] text-on-surface font-medium">ATS Score Report</span>
                  </div>
                  <span className="font-mono-label text-[9px] px-1.5 py-0.5 bg-[#1A1A1A] rounded text-on-surface-variant border border-[#262626]">JSON</span>
                </div>
                <div className="flex gap-2 mt-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="flex-1 h-7 rounded bg-[#1A1A1A] hover:bg-[#262626] text-on-surface-variant text-[11px] font-mono-label uppercase flex items-center justify-center gap-1 border border-[#262626]">
                    <span className="material-symbols-outlined text-[12px]">visibility</span> Preview
                  </button>
                  <button className="w-7 h-7 rounded bg-[#1A1A1A] hover:bg-[#262626] text-on-surface-variant flex items-center justify-center border border-[#262626]">
                    <span className="material-symbols-outlined text-[12px]">download</span>
                  </button>
                </div>
              </div>
              <div className="group p-md rounded-lg bg-[#121212] border border-[#262626] transition-colors hover:border-[#484949]">
                <div className="flex items-start justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-6 h-6 bg-[#1A1A1A] rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[14px]">description</span>
                    </div>
                    <span className="font-body-sm text-[13px] text-on-surface font-medium">Optimized Resume</span>
                  </div>
                  <span className="font-mono-label text-[9px] px-1.5 py-0.5 bg-[#1A1A1A] rounded text-on-surface-variant border border-[#262626]">PDF</span>
                </div>
                <div className="flex gap-2 mt-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="flex-1 h-7 rounded bg-[#1A1A1A] hover:bg-[#262626] text-on-surface-variant text-[11px] font-mono-label uppercase flex items-center justify-center gap-1 border border-[#262626]">
                    <span className="material-symbols-outlined text-[12px]">edit</span> Edit
                  </button>
                  <button className="w-7 h-7 rounded bg-[#1A1A1A] hover:bg-[#262626] text-on-surface-variant flex items-center justify-center border border-[#262626]">
                    <span className="material-symbols-outlined text-[12px]">download</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

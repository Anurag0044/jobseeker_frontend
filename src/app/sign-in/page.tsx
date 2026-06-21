"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas?.clientWidth || 1280;
      const h = canvas?.clientHeight || 720;
      if (canvas && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl =
      canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float line(vec2 p, vec2 a, vec2 b, float width) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return smoothstep(width, 0.0, length(pa - ba * h));
}

void main() {
    vec2 uv = v_texCoord;
    vec3 color = vec3(0.047, 0.047, 0.047); 
    
    float glow = distance(uv, vec2(0.3, 0.5));
    color += vec3(0.1, 0.2, 0.4) * exp(-glow * 4.0) * 0.2;
    
    vec2 grid_uv = uv * 40.0;
    vec2 grid = abs(fract(grid_uv - 0.5) - 0.5) / fwidth(grid_uv);
    float line_grid = min(grid.x, grid.y);
    color += (1.0 - smoothstep(0.0, 1.0, line_grid)) * 0.03;

    for(float i = 0.0; i < 5.0; i++) {
        float t = u_time * 0.2 + i * 1.5;
        vec2 p1 = vec2(fract(t * 0.1), 0.2 + 0.6 * sin(t));
        vec2 p2 = vec2(fract(t * 0.1 + 0.2), 0.2 + 0.6 * cos(t * 0.8));
        float l = line(uv, p1, p2, 0.001);
        color += vec3(0.37, 0.36, 0.9) * l * 0.3;
    }

    gl_FragColor = vec4(color, 1.0);
}`;

    function cs(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let animationFrameId: number;

    function render(t: number) {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas!.width, canvas!.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 24px 80px rgba(0,0,0,0.5);
        }
        .input-glow:focus-within {
            border-color: #5e5ce6;
            box-shadow: 0 0 0 2px rgba(94, 92, 230, 0.2);
        }
        .workflow-line {
            background: linear-gradient(to bottom, rgba(194, 193, 255, 0.1), rgba(194, 193, 255, 0.5), rgba(194, 193, 255, 0.1));
            background-size: 100% 200%;
            animation: pulse-line 2s infinite linear;
        }
        @keyframes pulse-line {
            0% { background-position: 0% -100%; }
            100% { background-position: 0% 100%; }
        }
      `}} />

      {/* Left Side: Ambient & Informational */}
      <div className="hidden lg:flex flex-col relative w-[60%] h-full p-xxl z-0 overflow-hidden border-r border-[#262626]">
        {/* WebGL Background */}
        <div className="absolute inset-0 w-full h-full -z-10 opacity-40" style={{ display: "block" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }}></canvas>
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-30 -z-10"></div>
        
        {/* Brand */}
        <div className="font-display-xl text-headline-lg text-primary-fixed mb-xxl tracking-tighter">
          ForgeX
        </div>
        
        {/* Copy */}
        <div className="max-w-[36rem] z-10 mt-auto mb-xl">
          <h1 className="font-display-xl text-display-xl mb-lg leading-tight">
            Forge Your Next<br />Opportunity.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mb-xl max-w-[28rem]">
            Multi-agent AI transforming resumes, cover letters, and career artifacts into interview-winning applications.
          </p>
          <ul className="space-y-sm font-mono-label text-mono-label text-on-surface-variant uppercase tracking-widest mb-xxl">
            <li className="flex items-center">
              <span className="material-symbols-outlined text-primary mr-sm text-[16px]">check</span> ATS Optimization
            </li>
            <li className="flex items-center">
              <span className="material-symbols-outlined text-primary mr-sm text-[16px]">check</span> Resume Tailoring
            </li>
            <li className="flex items-center">
              <span className="material-symbols-outlined text-primary mr-sm text-[16px]">check</span> Cover Letter Generation
            </li>
            <li className="flex items-center">
              <span className="material-symbols-outlined text-primary mr-sm text-[16px]">check</span> Interview Preparation
            </li>
          </ul>
        </div>
        
        {/* Workflow Visualization */}
        <div className="flex items-start space-x-md z-10 mt-auto pb-xl">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div className="h-8 w-px workflow-line my-sm"></div>
          </div>
          <div className="flex flex-col items-center mt-xl">
            <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(194,193,255,0.1)]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="h-8 w-px workflow-line my-sm"></div>
          </div>
          <div className="flex flex-col items-center mt-xxl">
            <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication (40%) */}
      <div className="w-full lg:w-[40%] h-full bg-surface-container-lowest relative z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-md lg:p-xxl w-full">
          {/* Auth Card */}
          <div className="w-full max-w-[28rem] glass-panel rounded-xl p-xl flex flex-col">
          <div className="text-center mb-xl">
            <div className="font-display-xl text-headline-lg-mobile text-primary mb-sm lg:hidden tracking-tighter">
              ForgeX
            </div>
            <h2 className="font-headline-lg text-title-md text-on-surface mb-xs">Welcome Back</h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Continue building career-winning applications.
            </p>
          </div>
          
          {/* Social Logins */}
          <div className="space-y-sm mb-lg flex-shrink-0">
            <button type="button" onClick={() => router.push('/workspace')} className="w-full h-10 flex items-center justify-center space-x-sm rounded border border-[#262626] bg-transparent hover:bg-[#1A1A1A] transition-colors duration-200 font-body-sm text-body-sm text-on-surface">
              <span className="material-symbols-outlined text-[18px]">code</span>
              <span>Continue with GitHub</span>
            </button>
            <button type="button" onClick={() => router.push('/workspace')} className="w-full h-10 flex items-center justify-center space-x-sm rounded border border-[#262626] bg-transparent hover:bg-[#1A1A1A] transition-colors duration-200 font-body-sm text-body-sm text-on-surface">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span>Continue with Google</span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-between mb-lg">
            <hr className="w-full border-t border-[#262626]" />
            <span className="px-sm font-mono-label text-label-caps text-on-surface-variant">OR</span>
            <hr className="w-full border-t border-[#262626]" />
          </div>
          
          {/* Form */}
          <form className="space-y-md flex-grow flex-shrink-0" onSubmit={(e) => { e.preventDefault(); router.push('/workspace'); }}>
            <div className="space-y-xs">
              <label className="font-mono-label text-label-caps text-on-surface-variant" htmlFor="email">
                Email
              </label>
              <div className="relative input-glow rounded border border-[#262626] bg-[#0A0A0A] transition-all duration-200">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">
                  person
                </span>
                <input
                  className="w-full h-10 pl-xl pr-sm bg-transparent border-none text-on-surface font-body-sm text-body-sm focus:ring-0 outline-none placeholder-[#555555]"
                  id="email"
                  placeholder="agent@forgex.ai"
                  type="email"
                />
              </div>
            </div>
            
            <div className="space-y-xs">
              <label className="font-mono-label text-label-caps text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <div className="relative input-glow rounded border border-[#262626] bg-[#0A0A0A] transition-all duration-200">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">
                  lock
                </span>
                <input
                  className="w-full h-10 pl-xl pr-sm bg-transparent border-none text-on-surface font-body-sm text-body-sm focus:ring-0 outline-none placeholder-[#555555]"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-sm">
              <label className="flex items-center space-x-xs cursor-pointer">
                <input
                  className="w-4 h-4 rounded border-[#262626] bg-[#0A0A0A] text-primary focus:ring-primary focus:ring-offset-[#121212]"
                  type="checkbox"
                />
                <span className="font-body-sm text-body-sm text-secondary">Remember Me</span>
              </label>
              <Link className="font-body-sm text-body-sm text-primary hover:text-primary-fixed transition-colors" href="#">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full h-10 mt-lg rounded bg-primary-container text-on-primary-container font-body-lg text-body-sm font-medium hover:bg-primary hover:text-on-primary transition-all duration-200 relative overflow-hidden group flex items-center justify-center"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </form>
          
          <div className="mt-xl text-center">
            <span className="font-body-sm text-body-sm text-secondary">Don't have an account? </span>
            <Link className="font-body-sm text-body-sm text-primary hover:text-primary-fixed transition-colors" href="#">
              Create Account
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

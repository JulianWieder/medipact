"use client";

// ── Stripe-Style WebGL Mesh-Gradient ─────────────────────────────────────────
//
// Der "echte" Stripe-Effekt: ein Fragment-Shader mit Simplex-Noise erzeugt
// organisch fließende Farbwellen mit Licht/Tiefe — deutlich lebendiger als
// die CSS-Blobs (BackgroundGradientAnimation), die als Sofort-Fallback
// darunter bleiben (Server-render → LCP-safe, Canvas blendet nach dem
// ersten gerenderten Frame weich ein).
//
// Performance: rendert intern mit halber Auflösung (Gradient ist ohnehin
// weich, CSS skaliert hoch), pausiert bei verstecktem Tab / außerhalb des
// Viewports, respektiert prefers-reduced-motion (ein statisches Frame).

import { useEffect, useRef } from "react";

// Farbpalette = dieselben Töne wie die CSS-Blobs (accent-200/400/600 + Indigo).
const COLORS: [number, number, number][] = [
  [0x04 / 255, 0x2f / 255, 0x2e / 255], // accent-950 – dunkle Basis ("transparent" unter mix-blend-screen)
  [0x0d / 255, 0x94 / 255, 0x88 / 255], // accent-600
  [0x2d / 255, 0xd4 / 255, 0xbf / 255], // accent-400
  [0x99 / 255, 0xf6 / 255, 0xe4 / 255], // accent-200
  [0x81 / 255, 0x8c / 255, 0xf8 / 255], // indigo-400 – Stripes kühle Zweitfarbe
];

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Ashima/IQ 3D-Simplex-Noise (public domain) + Domain-Warp für den Silk-Look.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c0, u_c1, u_c2, u_c3, u_c4;

vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.06;

  // Domain-Warp: die Wellen selbst wellen — das macht den Seiden-Look.
  p.y += 0.22 * sin(p.x * 1.6 + t * 2.0);
  p.x += 0.15 * snoise(vec3(p * 0.8, t * 0.7));

  float n1 = snoise(vec3(p * 1.1 + vec2(0.0, t * 0.6), t));
  float n2 = snoise(vec3(p * 1.7 - vec2(t * 0.4, 0.0), t * 1.25 + 13.0));
  float n3 = snoise(vec3(p * 2.3 + vec2(t * 0.5, -t * 0.3), t * 0.9 + 31.0));

  vec3 col = mix(u_c0, u_c1, smoothstep(-0.7, 0.7, n1));
  col = mix(col, u_c2, smoothstep(0.0, 0.9, n2));
  col = mix(col, u_c3, smoothstep(0.25, 1.0, n3) * 0.85);
  col = mix(col, u_c4, smoothstep(0.35, 1.0, snoise(vec3(p * 1.4 + 7.0, t * 1.1))) * 0.5);

  // Subtiles Streiflicht von oben → die "dreidimensionale Tiefe".
  float light = smoothstep(0.15, 1.0, n1 * 0.5 + n2 * 0.5) * (1.0 - uv.y) * 0.25;
  col += light;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    // Fallback bleibt sichtbar (CSS-Blobs) — nur still aufgeben.
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function StripeGradient({
  className = "",
}: {
  /** Positionierung/Blend, z.B. "absolute inset-0 mix-blend-screen opacity-60". */
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext("experimental-webgl", {
        antialias: false,
        alpha: false,
      }) as WebGLRenderingContext | null);
    if (!gl) return; // kein WebGL → CSS-Blobs bleiben allein sichtbar

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Fullscreen-Triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    ["u_c0", "u_c1", "u_c2", "u_c3", "u_c4"].forEach((name, i) => {
      gl.uniform3fv(gl.getUniformLocation(prog, name), COLORS[i]);
    });

    // Halbe Auflösung reicht — der Gradient ist per Definition weich.
    const SCALE = 0.5;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let visible = true;
    let firstFrame = true;
    const start = performance.now();

    const draw = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (firstFrame) {
        firstFrame = false;
        canvas.style.opacity = "1"; // weich über die CSS-Blobs einblenden
      }
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      if (reducedMotion) draw(); // ein statisches Frame, keine Animation
      else raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(canvas);
    const onVis = () => run();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none h-full w-full opacity-0 transition-opacity duration-1000 ${className}`}
    />
  );
}

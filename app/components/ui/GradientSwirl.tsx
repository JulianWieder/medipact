"use client";

// ── Kleiner weicher Gradient-Wirbel (Spirale) ────────────────────────────────
//
// Dezenter Akzent statt Fullscreen-Gradient: ein kleiner Vortex in den
// medipact-Accent-Tönen, der sich langsam dreht. WebGL-Shader mit
// Log-Spirale + weichem radialen Falloff (Alpha → Ränder lösen sich
// unsichtbar auf). Gleiche Schutzmechanik wie zuvor: pausiert bei
// hidden/offscreen, prefers-reduced-motion = statisches Frame,
// kein WebGL = einfach unsichtbar.

import { useEffect, useRef } from "react";

// medipact-Palette: accent-700 (Basis), accent-400, accent-200 + Indigo-Hauch.
const COLORS: [number, number, number][] = [
  [0x0f / 255, 0x76 / 255, 0x6e / 255], // accent-700
  [0x2d / 255, 0xd4 / 255, 0xbf / 255], // accent-400
  [0x99 / 255, 0xf6 / 255, 0xe4 / 255], // accent-200
  [0x81 / 255, 0x8c / 255, 0xf8 / 255], // indigo-400
];

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c0, u_c1, u_c2, u_c3;

void main() {
  vec2 uv = (gl_FragCoord.xy / u_res) * 2.0 - 1.0;
  float r = length(uv);
  float a = atan(uv.y, uv.x);
  float t = u_time * 0.16;

  // Log-Spirale: Arme winden sich zur Mitte, drehen langsam.
  float phase = a + 3.5 * log(r + 0.18) - t;
  phase += 0.45 * sin(t * 0.9 + r * 4.0); // organisches Atmen (mehr Bewegung)
  float arms = 0.5 + 0.5 * sin(2.0 * phase);
  arms = smoothstep(0.15, 0.95, arms); // weiche, breite Bänder
  arms = mix(0.5, arms, 0.7); // Kontrast: 0 = flach, 1 = voll

  vec3 col = mix(u_c0, u_c1, arms);
  col = mix(col, u_c2, smoothstep(0.55, 1.0, arms) * (1.0 - r) * 0.5);
  col = mix(col, u_c3, smoothstep(0.45, 1.0, r) * 0.3); // kühler Rand

  // Weicher radialer Falloff: außen komplett transparent, Mitte sanft.
  float alpha = smoothstep(1.0, 0.35, r) * 0.85;
  col *= 0.75; // Gesamthelligkeit etwas runter
  gl_FragColor = vec4(col * alpha, alpha); // premultiplied
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function GradientSwirl({
  className = "",
}: {
  /** Position + Größe, z.B. "absolute right-[6%] top-1/2 h-80 w-80 -translate-y-1/2". */
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
    });
    if (!gl) return; // kein WebGL → Wirbel bleibt einfach unsichtbar

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

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
    ["u_c0", "u_c1", "u_c2", "u_c3"].forEach((name, i) => {
      gl.uniform3fv(gl.getUniformLocation(prog, name), COLORS[i]);
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * 0.75));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * 0.75));
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
        canvas.style.opacity = "1";
      }
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      if (reducedMotion) draw();
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
      className={`pointer-events-none opacity-0 transition-opacity duration-1000 ${className}`}
    />
  );
}

// Step-through animator for lesson diagrams.
//
// Markup contract:
//   <figure class="diagram" data-anim>
//     <svg> …elements with data-step="N" appear from step N onward;
//           elements with data-step-only="N" appear ONLY at step N (frames);
//           lines/paths with class "flow" get marching-ants while current;
//           children with class "pulse" beat while their step is current… </svg>
//     <ol class="anim-cap"><li>caption for step 1</li>…</ol>
//     <figcaption>static caption</figcaption>
//   </figure>
//
// Without JS (or when printing) every element is visible — the animation is
// pure progressive enhancement. Honors prefers-reduced-motion.

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const fig of document.querySelectorAll("figure[data-anim]")) {
  const els = [...fig.querySelectorAll("[data-step],[data-step-only]")];
  const last = Math.max(0, ...els.map((e) => +(e.dataset.step ?? e.dataset.stepOnly)));
  if (!last) continue;

  const caps = [...fig.querySelectorAll(".anim-cap li")].map((li) => li.textContent.trim());
  let s = REDUCED ? last : 0;
  let timer = null;

  const controls = document.createElement("div");
  controls.className = "anim-controls";
  controls.innerHTML =
    '<button type="button" class="ab-prev" aria-label="previous step">‹</button>' +
    '<button type="button" class="ab-play">▶ play</button>' +
    '<button type="button" class="ab-next" aria-label="next step">›</button>' +
    '<span class="ab-pos"></span> <span class="ab-cap" aria-live="polite"></span>';
  fig.querySelector("svg").after(controls);

  const render = () => {
    for (const el of els) {
      const only = el.dataset.stepOnly;
      const n = +(el.dataset.step ?? only);
      const on = only != null ? s === n : s >= n;
      el.classList.toggle("on", on);
      el.classList.toggle("current", on && n === s);
    }
    controls.querySelector(".ab-pos").textContent = `${s}/${last}`;
    controls.querySelector(".ab-cap").textContent =
      s === 0 ? "press play, or step with ›" : caps[s - 1] ?? "";
    controls.querySelector(".ab-play").textContent = timer
      ? "❚❚ pause"
      : s >= last ? "↺ replay" : "▶ play";
  };

  const stop = () => { clearInterval(timer); timer = null; };
  const step = (d) => { stop(); s = Math.min(last, Math.max(0, s + d)); render(); };
  const play = () => {
    if (timer) { stop(); render(); return; }
    if (s >= last) s = 0;
    render();
    timer = setInterval(() => {
      s += 1;
      if (s >= last) stop();
      render();
    }, 1500);
    render();
  };

  controls.querySelector(".ab-prev").addEventListener("click", () => step(-1));
  controls.querySelector(".ab-next").addEventListener("click", () => step(1));
  controls.querySelector(".ab-play").addEventListener("click", play);

  for (const el of els) el.classList.add("anim-el");
  fig.classList.add("anim-ready");
  render();
}

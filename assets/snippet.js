// Adds a copy button to every copyable snippet (pre.cmd). Output blocks are skipped
// so learners never paste expected output into their terminal.
for (const pre of document.querySelectorAll("pre.cmd")) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.textContent = "copy";
  btn.addEventListener("click", async () => {
    const code = pre.querySelector("code");
    const text = (code ? code.innerText : pre.innerText).replace(/\n$/, "");
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "copied ✓";
      btn.classList.add("ok");
    } catch {
      btn.textContent = "select + ⌘C";
    }
    setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("ok"); }, 1600);
  });
  pre.appendChild(btn);
}

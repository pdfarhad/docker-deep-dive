// Course map for the student site, consumed by nav.js (the hamburger drawer)
// and kept in sync with index.html. Lessons are published here over time —
// update BOTH files whenever one is added.
window.COURSE_MAP = {
  title: "Docker Deep Dive",
  subtitle: "hands-on, from the terminal up",
  index: "index.html",
  lessons: [
    { n: "00", id: "00-setup",                        title: "Setup",                       path: "lessons/00-setup.html",                        min: 10 },
    { n: "P1", id: "p1-the-terminal-and-the-shell",   title: "The Terminal & the Shell",    path: "lessons/p1-the-terminal-and-the-shell.html",   min: 25 },
    { n: "P2", id: "p2-files-permissions-and-root",   title: "Files, Permissions & root",   path: "lessons/p2-files-permissions-and-root.html",   min: 25 },
  ],
  reference: [
    { title: "Linux & Shell Cheatsheet", path: "reference/linux-shell-cheatsheet.html" },
  ],
  external: [
    { title: "Labs repo — pdfarhad/docker-deep-dive", url: "https://github.com/pdfarhad/docker-deep-dive" },
  ],
};

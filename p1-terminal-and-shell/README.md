# P1 · The terminal & the shell

Two labs plus a detour: learn to move around inside a real Linux box, meet your own
terminal's "dialect", then throw the Linux machine away and grade yourself.
Paired lesson: **Prereq P1 — The Terminal & the Shell**.

**Works on macOS, Windows, and Linux.** The main lab runs inside an Ubuntu container,
which is identical on every host OS. Windows users: type the `docker …` lines in
PowerShell exactly as written (one marked exception below); don't translate the
in-container commands — they run inside Linux, not in PowerShell.

No app code here — this chapter is pure CLI, plus `check.sh`, a grader for your work.

New to the course? Whenever a `docker run …` line appears, just paste it — Lesson 1
explains every flag later. For now it's simply the fastest disposable Linux box you'll
ever own.

## Lab A — move around, inside your Linux box

```bash
docker run -it --name linuxbox ubuntu:24.04 bash
```

You're root (`#` prompt) in a fresh Ubuntu — the same Ubuntu whether your host is a
Mac, a Windows PC, or a Linux workstation. Look at the land and learn to move:

```sh
ls /
pwd
cd /var/log
pwd
cd ~
pwd
cd -
```

Absolute paths start at `/`; relative paths start where you are (`.` here, `..` up one,
`~` home). Now build a small project tree:

```sh
cd ~
mkdir -p harbor-notes/docs harbor-notes/drafts
cd harbor-notes
touch docs/setup.md docs/commands.md drafts/idea.txt
find .
cp -r docs docs-backup
mv drafts/idea.txt docs/idea.md
rm -r docs-backup
find .
```

- `mkdir -p` creates missing parents; `cp -r` is how directories copy.
- `mv` moves **and** renames — one command, both jobs.
- `rm -r` is forever. No trash. Read the line twice before Enter.

Also try `man ls` in here: the image is minimized, so you get a stub. Use `--help`
inside containers; `man` works on macOS/Linux hosts (`Get-Help` in PowerShell).

## Detour — your own terminal's dialect

On macOS and Linux the Lab A commands also work natively (same POSIX family). But ask
your shell what `ls` *really* is:

```bash
type ls          # bash/zsh — PowerShell: Get-Command ls
```

Three machines, three answers: a Mac may alias it to `eza`, Ubuntu aliases it to
`ls --color=auto`, and Windows PowerShell maps it to a completely different program,
`Get-ChildItem`. `type` is the truth-teller. Your host is a dialect — **the container
is the standard**, and it's the dialect Dockerfiles speak.

Windows users who want a native-feeling Linux terminal: install WSL 2 (Docker Desktop
on Windows already runs on it). Don't hand-translate labs into PowerShell syntax — the
flags genuinely don't map.

## Lab B — disposability + grade yourself

```sh
exit
```

```bash
docker rm linuxbox
docker run -it --name linuxbox ubuntu:24.04 bash
```

Inside: `ls /root` — empty. Containers forget; that's Lesson 1/5's whole story, and it
means you can never really break your practice machine. Exit and remove it again
(`exit`, then `docker rm linuxbox`), then — from this chapter folder — start a box that
can see the grader (`-v` shares this folder at `/labs`; Lesson 5 explains bind mounts;
`--rm` self-cleans on exit):

```bash
# macOS / Linux / WSL
docker run -it --rm -v "$PWD":/labs ubuntu:24.04 bash
```

```powershell
# Windows PowerShell — same thing, PowerShell's spelling of PWD
docker run -it --rm -v "${PWD}:/labs" ubuntu:24.04 bash
```

```sh
cd /root
mkdir -p harbor-notes/docs harbor-notes/drafts
cd harbor-notes
touch docs/setup.md docs/commands.md drafts/idea.txt
cp -r docs docs-backup
mv drafts/idea.txt docs/idea.md
rm -r docs-backup
sh /labs/check.sh /root/harbor-notes
```

Expected: `8 passed, 0 failed`. Any FAIL line names the exact move to redo — fix and
re-run the grader. On a macOS/Linux/WSL host you can also do the whole lab natively and
grade it with:

```bash
sh check.sh ~/harbor-notes
```

## What to notice

- Terminal draws, shell parses & finds, kernel runs — three programs, one cursor.
- Whatever your host OS, the container gave you the identical GNU/Linux environment —
  only your *host's* dialect of `ls` differed.
- The container forgot everything on `docker rm` — a feature, here: your practice
  machine is unbreakable.

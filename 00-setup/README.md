# 00 · Setup

Get a **current** Docker running on your machine. Ten minutes, once.

## Install (or update!)

Docker moves fast — a Desktop install from a year or two ago is missing tools this course
uses later (Compose niceties, `docker init`, Docker Scout). If you installed it a while
ago, update now: **Docker Desktop menu → Check for Updates**, or reinstall fresh.

| OS | Get it |
| --- | --- |
| macOS | [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) (pick Apple Silicon or Intel) |
| Windows | [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) (WSL 2 backend) |
| Linux | [Docker Engine](https://docs.docker.com/engine/install/) (Desktop optional) |

On macOS and Windows, Docker Desktop quietly runs a small **Linux virtual machine** —
containers are Linux processes, and that VM provides the Linux kernel they share. You'll
feel this once in chapter 01; otherwise it's invisible.

## Verify

Start Docker Desktop (whale icon in the menu bar/tray), then:

```bash
docker version
```

You should see both a **Client** and a **Server** section. If instead you get
`Cannot connect to the Docker daemon` — Docker Desktop isn't running; start it and retry.

```bash
docker run --rm hello-world
```

Prints a "Hello from Docker!" message. Congratulations — that was a container. Chapter 01
dissects what just happened.

## Optional: log in to Docker Hub

Anonymous pulls from Docker Hub are rate-limited (per 6 h, per IP). This course stays well
under the limit, but a free account removes the worry and is needed for chapter 09
(pushing your own image):

```bash
docker login
```

Reference: [Docker Hub usage and limits](https://docs.docker.com/docker-hub/usage/pulls/).

## Troubleshooting

- **`command not found: docker`** — Desktop installed but CLI not on PATH; restart your
  terminal (Desktop adds it), or reinstall.
- **Every pull fails with `401 Unauthorized`** — a stale Docker Hub login is sending
  expired credentials. `docker logout` clears it (anonymous pulls then work); `docker login`
  again whenever you like.
- **Daemon never becomes ready** — open Docker Desktop's Dashboard; it shows the engine
  state and error. On macOS, `Troubleshoot → Restart` fixes most sulks.

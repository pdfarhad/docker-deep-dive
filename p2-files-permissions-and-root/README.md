# P2 · Files, permissions & root

Who may read, write, or run every file on a Linux box — practiced until `Permission
denied` becomes a message you can fix in one command.
Paired lesson: **Prerequisite P2 — Files, Permissions & root**.

Everything runs inside a disposable Ubuntu container (your Mac stays untouched). The
`-v` flag mounts this folder at `/labs` so the self-grader is available inside —
it's Lesson 5's bind mount; for now, paste and go:

```bash
docker run -it --name permbox -v "$(pwd)":/labs ubuntu:24.04 bash
```

## Lab A — the filesystem tour

```sh
ls /
head -3 /etc/os-release
ls /var/log
ls -l /dev/null
ls -ld /root /tmp
```

Config lives in `/etc` (plain text), growing data in `/var`, programs in `/usr/bin` —
and `/dev/null` starts with `c` because even devices are files here.

## Lab B — identity

```sh
id
head -4 /etc/passwd
useradd -m -s /bin/bash dev
su - dev
id
touch /etc/evil
exit
```

You start as `uid=0(root)` — every container does by default. The `dev` user
(uid 1001) can't touch `/etc`. Users aren't magic: they're lines in `/etc/passwd`.

## Lab C — build this exact tree in /lab (the grader checks it)

Back as root:

```sh
mkdir /lab && cd /lab
echo 'echo "hello from $(whoami)"' > hello.sh
./hello.sh                # Permission denied — even for root
chmod u+x hello.sh
./hello.sh                # works

touch app.conf secret.env handoff.txt
mkdir public vault
chmod 644 app.conf        # rw-r--r--  world-readable config
chmod 600 secret.env      # rw-------  owner-only secret
chmod 755 public          # rwxr-xr-x  dirs need x to be entered
chmod 600 vault           # rw-------  no x: nobody can enter (not even to list-and-cd)
chown dev:dev handoff.txt
ls -l
```

## Lab D — feel the walls

```sh
su - dev -c "cd /lab/vault"        # denied: no x on the directory
su - dev -c "cat /etc/shadow"      # denied: that's the password store
mkdir /shared && chmod 777 /shared && touch /shared/root-owned.txt
su - dev -c "rm /shared/root-owned.txt" && echo "dev deleted root's file"
```

That last one is real: **w on a directory** means "may create/delete entries" — even
entries you don't own.

## Grade yourself

```sh
bash /labs/check.sh
```

All PASS? Done. Any FAIL tells you which file to fix and how.

## Clean up

```sh
exit
```

```bash
docker rm -f permbox
```

## What to notice

- A Docker image *is* one of these filesystem trees — `docker run --rm alpine ls /`
  and compare with what you just toured.
- Permissions live on the file, identity lives on the process; the kernel compares
  the two on every open. Owner class wins **even when it grants less** than group.
- Containers run as root unless the image says otherwise (`USER` — lesson 11);
  `docker run --rm postgres:16-alpine id postgres` shows a real image shipping its own user.

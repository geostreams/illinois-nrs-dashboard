# Common Issues

Running log of known operational issues and fixes.

---

## Strapi upload `EACCES` (production) — 2026-07-06

**Symptom:** Image upload fails with `EACCES: permission denied, open '/opt/app/public/uploads/...'`.

**Cause:** `docker-compose.prod.yml` bind-mounts `./cms/public` into the container, but Strapi runs as `node` (UID 1000). If host `./cms/public/uploads` is owned by another user with `755`, the container cannot write.

**Fix** (on the Docker host):

```bash
mkdir -p ./cms/public/uploads
sudo chown -R 1000:1000 ./cms/public/uploads
docker compose -f docker-compose.prod.yml restart strapi
```

**Check:** `ls -ld ./cms/public/uploads` should show UID/GID 1000. The `plugin.upload.security` warning in logs is unrelated.

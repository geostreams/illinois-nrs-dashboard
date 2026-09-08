export $(grep -v '^#' .env | xargs) && \
docker build --platform linux/amd64 \
  --build-arg CMS_URL=$CMS_URL \
  --build-arg NODE_ENV=$NODE_ENV \
  -t il-nrs-frontend .

export $(grep -v '^#' .env | xargs) && \
docker build --platform linux/amd64 \
  --build-arg CMS_API_URL=$CMS_API_URL \
  --build-arg NODE_ENV=$NODE_ENV \
  -t il-nrs-frontend .

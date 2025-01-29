# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Set environment variable for build time
ARG NEXT_PUBLIC_CMS_API_URL
ENV NEXT_PUBLIC_CMS_API_URL=${NEXT_PUBLIC_CMS_API_URL}
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# Build application
RUN yarn build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Set environment variable for runtime
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_CMS_API_URL=${NEXT_PUBLIC_CMS_API_URL}

# Start the application
CMD ["node", "server.js"]
EXPOSE 3000

FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev) for building
RUN pnpm install --frozen-lockfile

# Copy source code and config files
COPY . .

# Build the application
RUN pnpm build

# Clean up dev dependencies after build
RUN pnpm prune --prod

EXPOSE 3001

# Use production environment
ENV NODE_ENV=production

CMD ["pnpm", "start"]
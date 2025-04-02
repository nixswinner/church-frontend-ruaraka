FROM node:20-alpine as base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY .env.local .env.local

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
# Set standalone output explicitly
ENV NEXT_OUTPUT_STANDALONE true
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy everything from .next
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Set the correct permissions
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use npm start which works regardless of standalone mode
CMD ["npm", "start"]








# FROM node:20-alpine as base

# FROM base AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY .env.local .env.local

# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1
# # Set standalone output
# ENV NEXT_OUTPUT_STANDALONE true
# RUN npm run build

# FROM base AS runner
# WORKDIR /app
# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Create the required directory structure
# RUN mkdir -p .next/standalone .next/static

# # Copy necessary files from builder
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# # Set the correct permissions
# USER nextjs
# EXPOSE 3000
# ENV PORT 3000
# ENV HOSTNAME "0.0.0.0"

# # Make sure to start the server from the standalone directory
# CMD ["node", "server.js"]
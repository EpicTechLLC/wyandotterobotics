# Stage 1: Base image for dependencies and caching
FROM node:lts as builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file to install dependencies
COPY package*.json ./

# Install dependencies (this layer is cached unless package.json changes)
RUN npm install

# Copy the application files
COPY . .

# Enable Astro's Incremental Content Caching by persisting the cache directory
# Astro uses `.astro/cache/` for incremental builds
RUN mkdir -p .astro/cache

# Cache the build output for Incremental Content Caching
RUN npm run build

# Stage 2: Runtime for production
FROM node:lts as runtime

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.astro/cache /app/.astro/cache

# Install only production dependencies
RUN npm install

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321

# Expose port 4321 for the application
EXPOSE 4321

# Start the preview server
CMD ["npm", "run", "preview"]

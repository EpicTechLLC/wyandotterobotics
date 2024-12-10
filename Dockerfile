FROM node:lts AS runtime
WORKDIR /app

RUN mkdir /app/.astro
ARG CACHE_BUST=1
# Copy the cache directory from the build context
COPY .astro-cache /app/.astro/cache

# Add a cache-busting dummy command
RUN echo "Cache busting step: $(date +%s)"

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

RUN ls -la /app/.astro/cache && echo "Cache-busting: $(date +%s)"

# Build the Astro project
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321

# Expose port 4321 for the application
EXPOSE 4321

# Start the production server
CMD ["npm", "run", "preview"]
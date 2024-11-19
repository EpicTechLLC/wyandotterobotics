FROM node:lts as runtime
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Pass the Astro cache directory as a build argument
ARG CACHE_DIR=/app/.astro/cache
ENV ASTRO_CACHE_DIR=$CACHE_DIR

# Copy the cache directory (if provided)
COPY --from=cache $CACHE_DIR $CACHE_DIR

# Build the Astro project
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321

# Expose port 4321 for the application
EXPOSE 4321

# Start the production server
CMD ["npm", "run", "preview"]
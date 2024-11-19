FROM node:lts as runtime
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Build the Astro project
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321

# Expose port 4321 for the application
EXPOSE 4321

# Start the production server
CMD ["npm", "run", "preview"]
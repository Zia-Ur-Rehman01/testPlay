# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build (if using TypeScript)
RUN npm run build

# Expose backend port (change if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

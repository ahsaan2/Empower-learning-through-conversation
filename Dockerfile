# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend source files
COPY . .

# Expose port used by backend
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

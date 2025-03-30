FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 4001
EXPOSE 4001

# Start the application
CMD ["npm", "run", "dev"] 
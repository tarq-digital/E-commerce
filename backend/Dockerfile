FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port
EXPOSE 8000

# Start command
CMD [ "node", "src/server.js" ]

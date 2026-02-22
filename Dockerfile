# Base image
FROM node:20.12.0-alpine 

# 1. Use Alpine for a much smaller footprint (1/4 the size)
WORKDIR /usr/src/app

# 2. Copy only dependency files first
COPY package*.json ./

# 3. Install dependencies (this layer is now cached)
RUN npm install

# 4. Copy source code (Keep this AFTER npm install)
COPY . .

# 5. Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

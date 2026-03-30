FROM node:22-alpine

WORKDIR /app

# Install server dependencies
COPY server/package.json ./server/
RUN cd server && npm install

# Install client dependencies
COPY client/package.json ./client/
RUN cd client && npm install

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build client (Vite)
RUN cd client && npm run build

# Build server (TypeScript)
RUN cd server && npx tsc
RUN cd server && npm prune --production

EXPOSE 3000

CMD ["node", "server/dist/index.js"]

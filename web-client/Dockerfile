# Use a build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy src code
COPY . .

RUN npm run build

# Production stage
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]

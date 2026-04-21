FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# ✅ install ALL dependencies (including dev for TypeScript build)
RUN npm install

COPY . .

# ✅ compile TypeScript → dist/
RUN npm run build

EXPOSE 5003

# ✅ run compiled code
CMD ["npm", "start"]
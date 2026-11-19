# Image for the React frontend (development server). Build context: ../app
FROM node:20-alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

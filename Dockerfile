FROM node:18
WORKDIR /src  
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/main"]



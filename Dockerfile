FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ENV BOT_TOKEN=your-bot-token
# ENV WH_DOMAIN=your-conatainer-domain
ENV WH_PORT=443
EXPOSE ${WH_PORT}
CMD [ "npm", "run", "start:prod" ]

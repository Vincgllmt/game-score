FROM node:lts

RUN mkdir /opt/mongo-gui

WORKDIR /opt/mongo-gui

RUN npm install mongo-gui

RUN echo 'const getQuery = async (meta, prompt) => { return {}; }; module.exports = { getQuery }' > node_modules/mongo-gui/src/services/openai.js

ENTRYPOINT npx mongo-gui -u "$MONGO_URL"
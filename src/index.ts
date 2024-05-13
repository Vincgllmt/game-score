import 'dotenv/config';
import { app } from './app';
import { serve, setup } from 'swagger-ui-express';
import { parseDocument } from 'yaml';
import { readFileSync } from 'fs';

app.use('/api_doc', serve, setup(parseDocument(readFileSync("./openapi.yml").toString())));

app.listen(7777, () => {
    console.log('Serveur local démarré : http://localhost:7777');
});
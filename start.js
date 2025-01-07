const port = process.env.PORT || 3000;

import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();
app.use(express.static('dist/client/'));
app.use((req, res, next) => {
    ssrHandler(req, res, next);
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Now listening at http://localhost:${port}!`)
})
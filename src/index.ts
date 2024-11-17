import express from 'express';
import * as defaults from './defaults.json';
import path from 'path';
import cors from 'cors';

const app = express();

const port = process.env.WEB_PORT || defaults.web.port;
app.use(express.json());

const corsOptions = {
    origin: [
        process.env.STREAM_URL || defaults.web.streamUrl,
        process.env.API_URL || defaults.web.apiUrl
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/*', (req, res, next) => {
    const url = req.path;
    if (url.endsWith('/')) {
        return res.sendFile(path.join(__dirname, `../public${url}index.html`));
    }

    if (!path.extname(url)) {
        return res.sendFile(path.join(__dirname, `../public${url}.html`));
    }

    next();
});

app.get('/streamurl', (req, res) => {
    const streamurl = process.env.STREAM_URL || defaults.web.streamUrl;
    res.status(200).json({ streamurl });
});

app.get('/apiurl', (req, res) => {
    const apiurl = process.env.API_URL || defaults.web.apiUrl;
    res.status(200).json({ apiurl });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

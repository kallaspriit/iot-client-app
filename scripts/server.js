import express from 'express';
import path from 'path';

const port = process.argv.length >= 3 ? process.argv[2] : 80;
const basePath = path.join(__dirname, '..', 'dist');
const app = express();

app.use('/gfx', express.static(path.join(basePath, 'gfx')));
app.use('/static', express.static(path.join(basePath, 'static')));

app.get('/manifest.json', (req, res) => {
	res.sendFile(path.join(basePath, 'manifest.json'));
});

app.get('*', (req, res) => {
	res.sendFile(path.join(basePath, 'index.html'));
});

console.log(`starting server on port ${port}`);

app.listen(port, () => {
	console.log(`server running on port ${port}`);
});

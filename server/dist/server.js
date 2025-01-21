import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('../client/dist'));

app.use(express.json());

app.get('/', function (_req, res) {
  res.render('index', {});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
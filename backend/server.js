const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/presentationApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Модели
const Presentation = mongoose.model('Presentation', new mongoose.Schema({
  title: String,
}));

const Slide = mongoose.model('Slide', new mongoose.Schema({
  content: String,
  presentationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Presentation' },
}));

// Маршруты

// Создать презентацию
app.post('/api/presentations', async (req, res) => {
  const { title } = req.body;
  const presentation = new Presentation({ title });
  await presentation.save();
  res.status(201).json(presentation);
});

// Получить все презентации
app.get('/api/presentations', async (req, res) => {
  const presentations = await Presentation.find();
  res.json(presentations);
});

// Редактировать презентацию
app.put('/api/presentations/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const updatedPresentation = await Presentation.findByIdAndUpdate(id, { title }, { new: true });
  res.json(updatedPresentation);
});

// Удалить презентацию
app.delete('/api/presentations/:id', async (req, res) => {
  const { id } = req.params;
  await Presentation.findByIdAndDelete(id);
  res.status(204).send();
});

// Создать слайд
app.post('/api/presentations/:presentationId/slides', async (req, res) => {
  const { presentationId } = req.params;
  const { content } = req.body;
  const slide = new Slide({ content, presentationId });
  await slide.save();
  res.status(201).json(slide);
});

// Получить слайды презентации
app.get('/api/presentations/:presentationId/slides', async (req, res) => {
  const { presentationId } = req.params;
  const slides = await Slide.find({ presentationId });
  res.json(slides);
});

// Редактировать слайд
app.put('/api/presentations/:presentationId/slides/:slideId', async (req, res) => {
  const { slideId } = req.params;
  const { content } = req.body;
  const updatedSlide = await Slide.findByIdAndUpdate(slideId, { content }, { new: true });
  res.json(updatedSlide);
});

// Удалить слайд
app.delete('/api/presentations/:presentationId/slides/:slideId', async (req, res) => {
  const { slideId } = req.params;
  await Slide.findByIdAndDelete(slideId);
  res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});

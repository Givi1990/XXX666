import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Presentation.css'; // Импорт стилей

function Presentation() {
  const [presentations, setPresentations] = useState([]);
  const [currentPresentationId, setCurrentPresentationId] = useState(null);
  const [newSlideContent, setNewSlideContent] = useState('');
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    const response = await fetch('http://localhost:5000/api/presentations');
    const data = await response.json();
    setPresentations(data);
  };

  const fetchSlides = async (presentationId) => {
    const response = await fetch(`http://localhost:5000/api/presentations/${presentationId}/slides`);
    const data = await response.json();
    setSlides(data);
  };

  const handleCreatePresentation = async () => {
    const title = prompt('Введите название презентации:');
    if (title) {
      const response = await fetch('http://localhost:5000/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const newPresentation = await response.json();
      setPresentations([...presentations, newPresentation]);
    }
  };

  const handleAddSlide = async () => {
    if (!newSlideContent || !currentPresentationId) return;

    await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newSlideContent }),
    });

    setNewSlideContent('');
    fetchSlides(currentPresentationId); // Обновите слайды после добавления нового
  };

  const handleEditSlide = async (slideId) => {
    const newContent = prompt('Введите новый текст слайда:');
    if (newContent) {
      await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides/${slideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      });
      fetchSlides(currentPresentationId); // Обновите слайды после редактирования
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот слайд?')) {
      await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides/${slideId}`, {
        method: 'DELETE',
      });
      fetchSlides(currentPresentationId); // Обновите слайды после удаления
    }
  };

  const handlePresentationClick = (presentationId) => {
    setCurrentPresentationId(presentationId);
    fetchSlides(presentationId); // Загружаем слайды при выборе презентации
  };

  return (
    <div className="presentation-container mt-5">
      <h1 className="text-center mb-4">Презентации</h1>
      <Button variant="primary" onClick={handleCreatePresentation} className="mb-3">
        Создать презентацию
      </Button>

      <div className="row">
        <div className="col-md-4">
          <h3>Список презентаций</h3>
          <ul className="list-group">
            {presentations.map(presentation => (
              <li key={presentation._id} className="list-group-item" onClick={() => handlePresentationClick(presentation._id)}>
                {presentation.title}
              </li>
            ))}
          </ul>
        </div>

        {currentPresentationId && (
          <div className="col-md-8">
            <h3>Редактор слайдов</h3>
            <Form>
              <Form.Group controlId="newSlideContent">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newSlideContent}
                  onChange={(e) => setNewSlideContent(e.target.value)}
                  placeholder="Добавьте новый слайд"
                  className="slide-input"
                />
              </Form.Group>
              <Button variant="success" onClick={handleAddSlide}>
                Добавить слайд
              </Button>
            </Form>

            <div className="mt-4">
              <h4>Слайды</h4>
              {slides.map((slide) => (
                <div key={slide._id} className="slide-item">
                  <ReactMarkdown>{slide.content}</ReactMarkdown>
                  <div className="slide-actions">
                    <Button variant="warning" onClick={() => handleEditSlide(slide._id)} className="me-2">
                      Редактировать
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteSlide(slide._id)}>
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Presentation;

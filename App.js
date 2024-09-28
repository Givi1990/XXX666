import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const App = () => {
  const [presentations, setPresentations] = useState([]);
  const [currentPresentationId, setCurrentPresentationId] = useState(null);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    const response = await fetch('http://localhost:5000/api/presentations');
    const data = await response.json();
    setPresentations(data);
  };

  const createPresentation = async () => {
    const title = prompt('Введите название презентации:');
    if (title) {
      await fetch('http://localhost:5000/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      fetchPresentations();
    }
  };

  const handleEditPresentation = async (id) => {
    const newTitle = prompt('Введите новое название презентации:');
    if (newTitle) {
      await fetch(`http://localhost:5000/api/presentations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      fetchPresentations();
    }
  };

  const handleDeletePresentation = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту презентацию?')) {
      await fetch(`http://localhost:5000/api/presentations/${id}`, {
        method: 'DELETE',
      });
      fetchPresentations();
    }
  };

  const fetchSlides = async () => {
    if (currentPresentationId) {
      const response = await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides`);
      const data = await response.json();
      setSlides(data);
    }
  };

  const createSlide = async () => {
    const content = prompt('Введите текст слайда:');
    if (content && currentPresentationId) {
      await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      fetchSlides();
    }
  };

  const handleEditSlide = async (slideId) => {
    const newContent = prompt('Введите новый текст слайда:');
    if (newContent) {
      await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides/${slideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      fetchSlides();
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот слайд?')) {
      await fetch(`http://localhost:5000/api/presentations/${currentPresentationId}/slides/${slideId}`, {
        method: 'DELETE',
      });
      fetchSlides();
    }
  };

  return (
    <div className="App">
      <h1>Презентации</h1>
      <button onClick={createPresentation} className="create-button">Создать презентацию</button>
      <ul className="presentation-list">
        {presentations.map((presentation) => (
          <li key={presentation._id} className="presentation-item">
            <span>{presentation.title}</span>
            <div className="presentation-actions">
              <button onClick={() => {
                setCurrentPresentationId(presentation._id);
                fetchSlides();
              }}>Открыть</button>
              <button onClick={() => handleEditPresentation(presentation._id)}>Редактировать</button>
              <button onClick={() => handleDeletePresentation(presentation._id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>

      {currentPresentationId && (
        <div>
          <h2>Слайды</h2>
          <button onClick={createSlide} className="create-button">Создать слайд</button>
          <div className="slides">
            {slides.map((slide) => (
              <div key={slide._id} className="slide-item">
                <ReactMarkdown>{slide.content}</ReactMarkdown>
                <div className="slide-actions">
                  <button onClick={() => handleEditSlide(slide._id)}>Редактировать</button>
                  <button onClick={() => handleDeleteSlide(slide._id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

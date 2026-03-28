import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BASE_URL = 'https://balancehub-server.onrender.com';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '' });
  const [newAnswer, setNewAnswer] = useState('');
  const [search, setSearch] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const config = { headers: { 'x-auth-token': user.token } };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`, config)
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`${BASE_URL}/api/questions?category=${selectedCategory._id}&search=${search}`, config)
        .then(res => setQuestions(res.data))
        .catch(() => {});
    }
  }, [selectedCategory, search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedQuestion) {
      axios.get(`${BASE_URL}/api/answers/${selectedQuestion._id}`, config)
        .then(res => setAnswers(res.data))
        .catch(() => {});
    }
  }, [selectedQuestion]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/questions`, {
        title: newQuestion.title,
        body: newQuestion.body,
        category: selectedCategory._id
      }, config);
      setQuestions([res.data, ...questions]);
      setNewQuestion({ title: '', body: '' });
      setShowQuestionForm(false);
    } catch (err) {}
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/answers`, {
        body: newAnswer,
        question: selectedQuestion._id
      }, config);
      setAnswers([...answers, res.data]);
      setNewAnswer('');
    } catch (err) {}
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>⚖️ BalanceHub</h1>
        <div className="header-right">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="sidebar">
          {categories.map(cat => (
            <div
              key={cat._id}
              className={`category-item ${selectedCategory?._id === cat._id ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(cat); setSelectedQuestion(null); setShowQuestionForm(false); }}
            >
              {cat.name}
            </div>
          ))}
        </div>

        <div className="main-content">
          {!selectedCategory && (
            <p className="placeholder-text">Select a Category to view its questions.</p>
          )}

          {selectedCategory && !selectedQuestion && (
            <div>
              <div className="content-header">
                <h2>{selectedCategory.name}</h2>
                <div className="content-actions">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                  />
                  <button onClick={() => setShowQuestionForm(!showQuestionForm)} className="ask-btn">
                    {showQuestionForm ? 'Cancel' : 'Ask Question'}
                  </button>
                </div>
              </div>

              {showQuestionForm && (
                <form onSubmit={handleAskQuestion} className="question-form">
                  <input
                    type="text"
                    placeholder="Question title"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Describe your question..."
                    value={newQuestion.body}
                    onChange={(e) => setNewQuestion({...newQuestion, body: e.target.value})}
                    required
                  />
                  <button type="submit">Post Question</button>
                </form>
              )}

              <div className="questions-list">
                {questions.length === 0 && <p className="placeholder-text">No questions yet. Be the first to ask!</p>}
                {questions.map(q => (
                  <div key={q._id} className="question-card" onClick={() => setSelectedQuestion(q)}>
                    <h3>{q.title}</h3>
                    <p>{q.body}</p>
                    <span className="question-meta">Asked by {q.author.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedQuestion && (
            <div>
              <button onClick={() => setSelectedQuestion(null)} className="back-btn">← Back to Questions</button>
              <div className="question-detail">
                <h2>{selectedQuestion.title}</h2>
                <p>{selectedQuestion.body}</p>
                <span className="question-meta">Asked by {selectedQuestion.author.username}</span>
              </div>
              <h3>Answers</h3>
              <div className="answers-list">
                {answers.length === 0 && <p className="placeholder-text">No answers yet. Be the first to answer!</p>}
                {answers.map(a => (
                  <div key={a._id} className="answer-card">
                    <p>{a.body}</p>
                    <span className="question-meta">Answered by {a.author.username}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handlePostAnswer} className="answer-form">
                <textarea
                  placeholder="Write your answer..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  required
                />
                <button type="submit">Post Answer</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
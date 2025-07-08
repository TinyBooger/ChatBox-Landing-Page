import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import defaultPic from '../assets/images/default-picture.png';
import { buildSystemMessage } from '../utils/systemTemplate';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const [char, setChar] = useState(null);
  const [creator, setCreator] = useState(null);
  const [likes, setLikes] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const characterId = searchParams.get('character');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/current-user', { credentials: 'include' })
      .then(res => {
        if (!res.ok) navigate('/');
        return res.json();
      })
      .then(user => {
        if (user?.liked_characters?.includes(parseInt(characterId))) {
          setHasLiked(true);
        }
      });
  }, [characterId]);

  useEffect(() => {
    if (!characterId) return;

    fetch(`/api/character/${characterId}`)
      .then(res => res.json())
      .then(data => {
        setChar(data);
        setLikes(data.likes || 0);

        fetch(`/api/user/${data.creator_id}`)
          .then(r => r.json())
          .then(setCreator);

        fetch('/api/recent-characters/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character_id: characterId })
        });

        fetch('/api/views/increment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character_id: characterId })
        });

        if (data.greeting) {
          setMessages([
            { role: "system", content: buildSystemMessage(data.persona || "", data.example_messages || "") },
            { role: "assistant", content: data.greeting }
          ]);
        } else {
          setMessages([{ role: "system", content: buildSystemMessage(data.persona || "", data.example_messages || "") }]);
        }
      });
  }, [characterId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !char) return;

    const updatedMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(updatedMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character_id: characterId,
        messages: updatedMessages
      })
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
  };

  const likeCharacter = async () => {
    const res = await fetch(`/api/character/${characterId}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setHasLiked(true);
    }
  };

  return (
    <div className="d-flex h-100">
      <div className="flex-grow-1 d-flex flex-column p-3 overflow-hidden" style={{ minHeight: 0 }}>
        <h5 className="mb-3">
          Chatting to: {char ? char.name : 'Unknown'}
        </h5>
        <div className="flex-grow-1 border rounded p-3 mb-3 overflow-auto bg-light">
          {messages
            .filter(m => m.role !== 'system')
            .map((m, i) => (
              <div key={i}>
                <strong>{m.role === 'user' ? 'You' : char.name}:</strong> {m.content}
              </div>
          ))}
        </div>
        <form className="d-flex gap-2 align-items-center bg-light rounded p-2" onSubmit={handleSubmit}>
          <input
            className="form-control border-0 bg-light"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <button className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <i className="bi bi-send"></i>
          </button>
        </form>
      </div>

      <aside className="border-start d-flex flex-column bg-white shadow-sm p-3" style={{ width: 280, minHeight: 0 }}>
        <img
          src={char?.picture || defaultPic}
          alt="Character Avatar"
          className="rounded-circle mb-3"
          style={{ width: 120, height: 120, objectFit: 'cover', border: '2px solid #ccc' }}
        />

        <h5 className="fw-bold mb-1 text-center">{char?.name}</h5>

        {char?.tagline && (
          <p className="text-muted fst-italic small text-center px-2 mb-2">{char.tagline}</p>
        )}

        <div className="w-100 text-start mt-3">
          <p className="mb-1">
            <strong>Creator:</strong>{' '}
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
              onClick={() => navigate(`/profile/${char?.creator_id}`)}
            >
              {creator?.name || 'Unknown'}
            </span>
          </p>
          <p className="mb-1"><strong>Created:</strong> {char && new Date(char.created_time).toLocaleDateString()}</p>
          <p className="mb-1"><strong>Views:</strong> {char?.views || 0}</p>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-2 bg-light rounded px-3 py-2 my-3">
          <span className="fw-semibold">👍 {likes}</span>
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ minWidth: 36 }}
            onClick={likeCharacter}
            disabled={hasLiked}
          >
            <i className="bi bi-hand-thumbs-up"></i>
          </button>
        </div>

        {char?.tags?.length > 0 && (
          <div className="w-100 text-start">
            <strong>Tags:</strong>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {char.tags.map((tag, i) => (
                <span key={i} className="badge bg-secondary text-light">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function AccountSetupPage() {
  const MAX_NAME_LENGTH = 50;
  const MAX_EMAIL_LENGTH = 100;
  const MAX_PASSWORD_LENGTH = 100;

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("name", name.trim());
    if (e.target.profile_pic.files[0]) {
      formData.append("profile_pic", e.target.profile_pic.files[0]);
    }

    const res = await fetch('/api/account-setup', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(data.message || JSON.stringify(data));

    if (res.ok) {
      navigate('/');
    }
  };

  return (
    <div
      className="bg-light d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="container">
        <div className="mx-auto" style={{ maxWidth: 400 }}>
          <h2 className="mb-4 text-center">Set Up Your Account</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            
            <div className="mb-3 position-relative">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                value={email}
                maxLength={MAX_EMAIL_LENGTH}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingRight: "3rem" }}
              />
              <small className="text-muted position-absolute" style={{ top: 0, right: 0 }}>
                {email.length}/{MAX_EMAIL_LENGTH}
              </small>
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                value={password}
                maxLength={MAX_PASSWORD_LENGTH}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "3rem" }}
              />
              <small className="text-muted position-absolute" style={{ top: 0, right: 0 }}>
                {password.length}/{MAX_PASSWORD_LENGTH}
              </small>
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingRight: "3rem" }}
              />
              <small className="text-muted position-absolute" style={{ top: 0, right: 0 }}>
                {name.length}/{MAX_NAME_LENGTH}
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Profile Picture</label>
              <input type="file" name="profile_pic" className="form-control" accept="image/*" />
            </div>

            <button type="submit" className="btn btn-dark w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

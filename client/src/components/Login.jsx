import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Hibás email vagy jelszó.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] px-4 py-8">
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Bejelentkezés</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Jelszó</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <div className="text-red-500 font-medium">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary w-full mt-4">
            Bejelentkezés
          </button>
        </form>

        {/* Extra buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            className="btn btn-outline w-full"
            onClick={() => navigate('/register')}
          >
            Regisztráció
          </button>
          <button
            className="btn btn-link text-sm text-blue-600 hover:underline"
            onClick={() => navigate('/forgot-password')}
          >
            Elfelejtett jelszó?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

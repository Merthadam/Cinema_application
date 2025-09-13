import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    const { name, email, password } = formData;

    if (!name.trim()) newErrors.name = 'Név megadása kötelező.';
    if (!email.trim()) {
      newErrors.email = 'Email megadása kötelező.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Érvénytelen email formátum.';
    }
    if (!password.trim()) {
      newErrors.password = 'Jelszó megadása kötelező.';
    } else if (password.length < 6) {
      newErrors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null, general: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const action = await dispatch(
        registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        })
      );

      if (action.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      } else {
        setErrors({ general: action.payload || 'Regisztráció sikertelen.' });
      }
    } catch {
      setErrors({ general: 'Hálózati hiba. Próbáld újra.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] px-4 py-8">
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Regisztráció</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Név"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Jelszó újra (nem kötelező)"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Regisztráció...' : 'Regisztráció'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Már van fiókod?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Jelentkezz be
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;

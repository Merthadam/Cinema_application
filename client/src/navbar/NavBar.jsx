
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold text-lg hover:text-lime-400">Főoldal</Link>

        {user && (
          <Link to="/reservations" className="hover:text-lime-400">Foglalásaim</Link>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/movies/new" className="hover:text-lime-400">Új film</Link>
            <Link to="/screenings/new" className="hover:text-lime-400">Új vetítés</Link>
          </>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-lime-400">Bejelentkezés</Link>
            <Link to="/register" className="hover:text-lime-400">Regisztráció</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:text-red-400 font-medium"
          >
            Kijelentkezés
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

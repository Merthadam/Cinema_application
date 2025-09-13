import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Scheduler from './pages/Scheduler';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './navbar/NavBar';
import ReservationsPage from './pages/ReservationsPage';
import { ApiProvider } from './store/ApiContext';
import { CinemaProvider } from './store/cinemaContext';
import { AuthProvider } from './store/AuthContext';
import { useSelector } from 'react-redux'; // ✅ using Redux for user
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';

const RequireAuth = ({ children }) => {
  const user = useSelector((state) => state.auth.user); // ✅ read from Redux store
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ReduxProvider store={store}>
      <AuthProvider> {/* Still included, in case you use it elsewhere */}
        <CinemaProvider>
          <ApiProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Scheduler />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reservations" element={<RequireAuth><ReservationsPage /></RequireAuth>} />
                <Route path="/movies/new" element={<div>Új film</div>} />
                <Route path="/screenings/new" element={<div>Új vetítés</div>} />
              </Routes>
            </Router>
          </ApiProvider>
        </CinemaProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}

export default App;

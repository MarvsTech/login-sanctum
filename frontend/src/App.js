import Login from './pages/Login';
import Signup from './pages/Signup';

import './styles.css';
import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

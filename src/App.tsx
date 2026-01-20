import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LevelDetail from './pages/LevelDetail';
import Success from './pages/Success';
import Registration from './pages/Registration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page - Main landing page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Level Detail Pages - Course information and enrollment */}
        <Route path="/level/:id" element={<LevelDetail />} />
        
        {/* Course Registration Page - Calendar, registration, and payment */}
        <Route path="/registration" element={<Registration />} />
        
        {/* Success Page - After successful payment */}
        <Route path="/success" element={<Success />} />
        
        {/* Fallback - Redirect unknown routes to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

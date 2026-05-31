import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatPage from './pages/ChatPage';
import Contact from './pages/Contact';
import Settings from './pages/Settings';


// Wrapper component to conditionally render layout elements
function LayoutContent() {
  const location = useLocation();
  
  // Pages that should be completely standalone (no navbar/footer)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Don't show footer on the chat page to maximize screen space
  const showFooter = !isAuthPage && location.pathname !== '/chat';

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 flex flex-col">
      {!isAuthPage && <Navbar />}
      
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />

        </Routes>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <LayoutContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

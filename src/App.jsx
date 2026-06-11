import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import Lesson from './pages/Lesson'
import Login from './pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
      <BrowserRouter>
        <div className="app grain">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  )
}

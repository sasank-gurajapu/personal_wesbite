import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import SubpageLayout from './components/SubpageLayout.jsx'
import Home from './pages/Home.jsx'
import ProfessionalLife from './pages/ProfessionalLife.jsx'
import ThoughtsAndMore from './pages/ThoughtsAndMore.jsx'
import Photos from './pages/Photos.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<SubpageLayout />}>
              <Route path="/professional-life" element={<ProfessionalLife />} />
              <Route path="/thoughts-and-more" element={<ThoughtsAndMore />} />
              <Route path="/photos" element={<Photos />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

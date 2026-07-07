import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import SubpageLayout from './components/SubpageLayout.jsx'
import Home from './pages/Home.jsx'
import ProfessionalLife from './pages/ProfessionalLife.jsx'
import DeepDive from './pages/DeepDive.jsx'
import ThoughtsAndMore from './pages/ThoughtsAndMore.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Photos from './pages/Photos.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="page">
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<SubpageLayout />}>
              <Route path="/professional-life" element={<ProfessionalLife />} />
              <Route path="/professional-life/deepdive/:slug" element={<DeepDive />} />
              <Route path="/thoughts-and-more" element={<ThoughtsAndMore />} />
              <Route path="/thoughts-and-more/:slug" element={<BlogPost />} />
              <Route path="/photos" element={<Photos />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import BlogCategory from './pages/BlogCategory'
import Contact from './pages/Contact'
import DailyReport from './pages/DailyReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/*" element={<BlogPost />} />
        <Route path="blog/category/:category" element={<BlogCategory />} />
        <Route path="daily" element={<DailyReport />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
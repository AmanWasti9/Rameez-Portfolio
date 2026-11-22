import { Route, Routes } from 'react-router-dom';
import { TransitionProvider } from './components/Transition';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Cursor } from './components/Cursor';
import Home from './pages/Home';
import Work from './pages/Work';
import Project from './pages/Project';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <TransitionProvider>
      <a className="skip" href="#content">Skip to content</a>
      <Nav />
      <div id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <Cursor />
    </TransitionProvider>
  );
}

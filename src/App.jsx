import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage/LandingPage';
import PhimBo from './components/PhimBo/PhimBo';
import FilmInfo from './components/FilmInfo/FilmInfo';
import Phimle from './components/Phim lẻ/Phimle';
import FilmSearch from './components/FilmSearch/FilmSearch';
import MyList from './components/MyList/MyList';
import Discover from './components/Discover/Discover';
import Footer from './components/Footer/Footer';
import MovieShuffle from './components/MovieShuffle/MovieShuffle';
import { Analytics } from '@vercel/analytics/react';


function App() {
  const [isShuffleOpen, setIsShuffleOpen] = useState(false);

  return (
    <Router> 
      <div className="bg-netflix-dark min-h-screen text-white flex flex-col font-sans">
        <Header onTriggerShuffle={() => setIsShuffleOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/phim-bo" element={<PhimBo isPage={true} />} />
            <Route path="/phim/:slug" element={<FilmInfo />} />
            <Route path="/phim-le" element={<Phimle isPage={true} />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/search/:keyword" element={<FilmSearch/>}/>
            <Route path="/my-list" element={<MyList/>}/>
          </Routes>
        </main>
        <Footer/>

        {/* Global Movie Shuffle Wheel */}
        <MovieShuffle 
          isOpen={isShuffleOpen} 
          onClose={() => setIsShuffleOpen(false)} 
        />
        <Analytics mode={import.meta.env.MODE} />
      </div>
    </Router>
  );
}

export default App;

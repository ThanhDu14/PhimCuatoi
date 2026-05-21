import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage/LandingPage';
import PhimBo from './components/PhimBo/PhimBo';
import FilmInfo from './components/FilmInfo/FilmInfo';
import Phimle from './components/Phim lẻ/Phimle';
import FilmSearch from './components/FilmSearch/FilmSearch';
import MyList from './components/MyList/MyList';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router> 
      <div className="bg-netflix-dark min-h-screen text-white flex flex-col font-sans">
        <Header/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/phim-bo" element={<PhimBo />} />
            <Route path="/phim/:slug" element={<FilmInfo />} />
            <Route path="/phim-le" element={<Phimle/> }/>
            <Route path="/search/:keyword" element={<FilmSearch/>}/>
            <Route path="/my-list" element={<MyList/>}/>
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;

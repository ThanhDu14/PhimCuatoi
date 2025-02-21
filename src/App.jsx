import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage/LandingPage';
import PhimBo from './components/PhimBo/PhimBo';
import FilmInfo from './components/FilmInfo/FilmInfo';
import Phimle from './components/Phim lẻ/Phimle';
import FilmSearch from './components/FilmSearch/FilmSearch';
function App() {
  return (
    <Router> 
      <Header/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/phim-bo" element={<PhimBo />} />
        <Route path="/phim/:slug" element={<FilmInfo />} />
        <Route path="/phim-le" element={<Phimle/> }/>
        <Route path="/search/:keyword" element={<FilmSearch/>}/>
      </Routes>
    </Router>
  );
}

export default App;

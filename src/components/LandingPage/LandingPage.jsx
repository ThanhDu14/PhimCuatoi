import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import PhimBo from '../PhimBo/PhimBo';
import PhimLe from '../Phim lẻ/Phimle';
import PhimHanhDong from "../Phim Hành Động/PhimHanhDong";

function LandingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1");
        const result = await response.json();

        if (result.items) {
          setData(result.items);
        } else {
          setError("Không có dữ liệu phim.");
        }
      } catch (err) {
        setError("Lỗi khi tải danh sách phim.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAPI();
  }, []);

  const handleFilmSelect = (slug) => {
    navigate(`/phim/${slug}`);
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 3000, min: 1000 }, items: 1 },
    desktop: { breakpoint: { max: 1000, min: 800 }, items: 1 },
    tablet: { breakpoint: { max: 800, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  return (
    <div className="bg-netflix-dark min-h-screen text-white overflow-x-hidden">
      {/* Hero Carousel */}
      {loading ? (
        <div className="relative h-[75vh] w-full bg-netflix-dark animate-pulse flex items-center justify-center">
          <div className="text-netflix-red font-bold text-2xl">Đang tải danh sách phim mới...</div>
        </div>
      ) : error ? (
        <div className="text-netflix-red text-center pt-32 text-lg font-semibold">{error}</div>
      ) : data.length ? (
        <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={5000}
            infinite={true}
            arrows={false}
            showDots={true}
            renderDotsOutside={false}
            dotListClass="custom-dot-list"
            className="h-full"
          >
            {data.slice(0, 10).map((item, index) => (
              <div key={index} className="relative h-[70vh] md:h-[85vh] w-full">
                {/* Background Image Container */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${item.thumb_url})` }}
                />

                {/* Dark Gradients Layering */}
                {/* 1. Left-to-Right gradient for content readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/60 to-transparent z-10" />
                
                {/* 2. Bottom-to-Top gradient for blending with dark background */}
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent z-10" />

                {/* 3. Top-to-Bottom gradient for header visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10" />

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-16 md:bottom-24 max-w-7xl mx-auto px-4 md:px-8 z-20 flex flex-col items-start space-y-4">
                  {/* Category / Type badge */}
                  <span className="bg-netflix-red text-white text-xs font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider shadow-md">
                    Mới Cập Nhật
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl md:text-6xl font-black font-sans leading-tight max-w-xl md:max-w-2xl drop-shadow-lg text-white">
                    {item.name}
                  </h1>

                  {/* Original name and year */}
                  <div className="flex items-center space-x-3 text-sm font-semibold text-netflix-textGray">
                    <span>{item.origin_name}</span>
                    <span className="w-1.5 h-1.5 bg-netflix-textGray rounded-full"></span>
                    <span className="text-white border border-netflix-textGray/40 px-1.5 py-0.5 rounded text-xs">
                      {item.year || 'N/A'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleFilmSelect(item.slug)}
                      className="flex items-center justify-center space-x-2 bg-white text-black hover:bg-white/80 font-bold px-6 py-3 rounded transition-colors duration-200 text-sm md:text-base shadow-lg transform active:scale-95"
                    >
                      <FaPlay className="text-xs" />
                      <span>Xem Ngay</span>
                    </button>
                    
                    <button
                      onClick={() => handleFilmSelect(item.slug)}
                      className="flex items-center justify-center space-x-2 bg-netflix-lightCard/80 text-white hover:bg-netflix-lightCard font-bold px-6 py-3 rounded transition-colors duration-200 text-sm md:text-base shadow-lg border border-white/10 transform active:scale-95"
                    >
                      <FaInfoCircle className="text-sm" />
                      <span>Thông Tin Chi Tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <div className="text-white text-center pt-32 text-lg">Không có phim mới.</div>
      )}

      {/* Movie Rows List */}
      <div className="relative bg-netflix-dark z-20 pb-16 space-y-2 md:space-y-6">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <PhimBo />
          <PhimLe />
          <PhimHanhDong />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
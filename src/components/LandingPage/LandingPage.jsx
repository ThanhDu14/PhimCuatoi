import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import FilmInfo from '../FilmInfo/FilmInfo';
import PhimBo from '../PhimBo/PhimBo';
import PhimLe from '../Phim lẻ/Phimle';
function LandingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khai báo useNavigate

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=8");
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

  // Hàm xử lý khi click vào phim
  const handleFilmSelect = (slug) => {
    navigate(`/phim/${slug}`); // Chuyển trang đến /phim/slug
  };
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 2000, min: 1000 }, items: 1 },
    desktop: { breakpoint: { max: 1000, min: 800 }, items: 1 },
    tablet: { breakpoint: { max: 800, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex space-x-4 justify-center overflow-hidden">
            {Array.from({ length: 1 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-[1700px] h-[700px] bg-gray-300 rounded-md"></div>
              </div>
            ))} 
          </div>
        </div>

      ) : error ? (
        <div className="text-red-500 text-center mt-20 text-lg">{error}</div>
      ) : data.length ? (
        <Carousel responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={2000}
          infinite={true}
          swipeable={true}
          draggable={true}  >
          {data.map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute top-[200px] left-20 text-white text-4xl font-bold max-w-[400px]">
                {item.name}
              </div>
              <button
                onClick={() => handleFilmSelect(item.slug)}
                className="absolute top-[450px] left-20 border px-4 py-2 bg-red-500 text-white hover:bg-red-700 transition">
                Xem Ngay
              </button>
              <img src={item.thumb_url} alt={`Slide ${index}`} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="text-white text-center mt-20 text-lg">Không có phim mới.</div>
      )}
      <PhimBo  />
      <PhimLe />
    </div>
    
  );
}

export default LandingPage;

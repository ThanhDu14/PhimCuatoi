import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import FilmInfo from '../FilmInfo/FilmInfo';

function LandingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khai báo useNavigate

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat");
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

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center mt-[200px]">
          <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
            <div className="w-4 h-4 rounded-full bg-red-500 animate-ping [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-red-500 animate-ping [animation-delay:-0.5s]"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-20 text-lg">{error}</div>
      ) : data.length ? (
        <AwesomeSlider animation="cubeAnimation">
          {data.map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute top-[200px] left-20 text-white text-8xl font-bold max-w-[1000px]">
                {item.name}
              </div>
              <button
                onClick={() => handleFilmSelect(item.slug)} // Chuyển trang khi click
                className="absolute top-[450px] left-20 border px-4 py-2 bg-red-500 text-white hover:bg-red-700 transition">
                Xem Ngay
              </button>
              <img src={item.thumb_url} alt={`Slide ${index}`} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          ))}
        </AwesomeSlider>
      ) : (
        <div className="text-white text-center mt-20 text-lg">Không có phim mới.</div>
      )}
    </div>
  );
}

export default LandingPage;

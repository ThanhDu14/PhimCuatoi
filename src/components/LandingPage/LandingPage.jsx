import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
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
        <Carousel
          responsive={responsive}
          autoPlay={true}

          infinite={true}

        >
          {data.map((item, index) => (
            <div key={index} className="relative">

              <div className="relative">
                {/* Lớp phủ mờ vừa phải */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                {/* Nội dung trên ảnh */}
                <div className="absolute top-[10%] left-[5%] md:top-[200px] md:left-20 text-white z-10">
                  <img
                    src={item.poster_url}
                    className="w-[200px] h-[300px] object-cover mb-[20px] cursor-pointer"
                  />
                  <h1 className="text-2xl md:text-4xl font-bold max-w-[200px] md:max-w-[400px]">
                    {item.name}
                  </h1>
                  <button
                    onClick={() => handleFilmSelect(item.slug)}
                    className="mt-4 border px-4 py-2 bg-red-500 text-white hover:bg-red-700 transition text-sm md:text-base"
                  >
                    Xem Ngay
                  </button>
                </div>

                {/* Ảnh nền */}
                <img
                  src={item.thumb_url}
                  alt={`Slide ${index}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="text-white text-center mt-20 text-lg">Không có phim mới.</div>
      )}
      <div className="bg-gradient-to-r from-[#7773bd] via-[#acacec] to-[#cfe0e3]">
        <PhimBo />
        <PhimLe />
        <PhimHanhDong />
      </div>
    </div>
  );
}

export default LandingPage;
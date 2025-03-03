import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import background from "../../assets/background2.jpg";
const baseUrl = "https://phimimg.com/";
const imageUrl = background;
const PhimLe = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAPI = () => {
            fetch("https://phimapi.com/v1/api/danh-sach/phim-le")
                .then(res => res.json())
                .then(data => {
                    setData(data.data.items);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                    setLoading(false);
                });
        };

        fetchAPI();
    }, []);

    const handleClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 2000, min: 1000 }, items: 5 },
        desktop: { breakpoint: { max: 1000, min: 800 }, items: 3 },
        tablet: { breakpoint: { max: 800, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    return (
        <div className={`w-full h-screen bg-[url('${imageUrl}')] bg-cover bg-center container` }>
            <div className="p-4 text-white font-bold text-4xl">Phim Lẻ</div>
            {loading ? (
                <div className="flex space-x-4 justify-between overflow-hidden">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center animate-pulse">
                            <div className="w-[200px] h-[300px] bg-gray-300 rounded-md"></div>
                            <div className="w-[150px] h-4 bg-gray-300 mt-3 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <Carousel responsive={responsive} className="flex justify-between">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img
                                src={`${baseUrl}${item.poster_url}`}
                                alt={`Phim ${item.name}`}
                                className="w-[200px] h-[300px] object-cover mb-[20px] cursor-pointer transition-transform duration-500 hover:scale-110"
                                onClick={() => handleClick(item.slug)}
                            />
                            <button onClick={() => handleClick(item.slug)} className="font-bold text-gray-400">
                                {item.name}
                            </button>
                        </div>
                    ))}
                </Carousel>
            )}
        </div>
    );
};

export default PhimLe;

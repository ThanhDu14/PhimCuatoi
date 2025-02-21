import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const baseUrl = "https://phimimg.com/";

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
                    console.error('Lỗi khi lấy dữ liệu:', error);
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
        <div className="container">
            <div className="mt-[100px] mb-[50px] font-bold text-4xl">Phim Lẻ</div>

            {loading ? (
                <div className="flex flex-row gap-2 justify-center items-center mt-[200px]">
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
            ) : (
                <div>
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
                </div>
            )}
        </div>
    );
};

export default PhimLe;

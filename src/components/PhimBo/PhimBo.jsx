import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const baseUrl = "https://phimimg.com/";

const PhimBo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchAPI = () => {
            fetch("https://phimapi.com/v1/api/danh-sach/phim-bo")
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
        superLargeDesktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        desktop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
    };

    return (
        <div className="pt-12 pb-4">
            <h2 className="text-white font-bold text-xl md:text-2xl font-sans mb-6 border-l-4 border-netflix-red pl-3 tracking-wide">
                Phim Bộ Mới Nhất
            </h2>

            {loading ? (
                <div className="flex space-x-4 justify-between overflow-hidden py-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center animate-pulse px-2">
                            <div className="w-full aspect-[2/3] bg-netflix-card rounded-md"></div>
                            <div className="w-3/4 h-3 bg-netflix-card mt-3 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative">
                    <Carousel 
                        responsive={responsive} 
                        infinite={true}
                        draggable={true}
                        keyBoardControl={true}
                        containerClass="carousel-container"
                        itemClass="px-2"
                    >
                        {data.map((item, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-netflix-card rounded-lg overflow-hidden border border-white/5 cursor-pointer movie-card-hover pb-2"
                                onClick={() => handleClick(item.slug)}
                            >
                                <div className="aspect-[2/3] overflow-hidden">
                                    <img 
                                        src={`${baseUrl}${item.poster_url}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-2.5">
                                    <p className="font-bold text-sm text-white truncate group-hover:text-netflix-red transition-colors duration-200">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-netflix-textGray truncate">
                                        {item.origin_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}
        </div>
    );
};

export default PhimBo;

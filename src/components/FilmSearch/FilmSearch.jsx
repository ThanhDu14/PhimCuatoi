import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const baseUrl = "https://phimimg.com/";

const FilmSearch = () => {
    const { keyword } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 2000, min: 1000 }, items: 5 },
        desktop: { breakpoint: { max: 1000, min: 800 }, items: 3 },
        tablet: { breakpoint: { max: 800, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    useEffect(() => {
        const FetchApi = async () => {
            try {
                const res = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}`);
                const result = await res.json();
                setData(result.data.items); 
                
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        if (keyword) FetchApi();
    }, [keyword]);

    const handleClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    return (
        <div>
            <h2 className="font-bold text-4xl mb-[60px] mt-[40px]">Kết quả tìm kiếm cho: {keyword}</h2>
            {data.length > 0 ? (
                
                <Carousel responsive={responsive} className="flex justify-between">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img
                                src={`${baseUrl}${item.poster_url}`}
                                alt={`Phim ${item.name}`}
                                className="w-[200px] h-[300px] object-cover mb-[20px] cursor-pointer"
                                onClick={() => handleClick(item.slug)}
                            />
                            <button onClick={() => handleClick(item.slug)} className="font-bold text-gray-400">
                                {item.name}
                            </button>
                        </div>
                    ))}
                </Carousel>
            ) : (
                <p className="text-gray-400 text-center">Không tìm thấy kết quả.</p>
            )}
        </div>
    );
};

export default FilmSearch;

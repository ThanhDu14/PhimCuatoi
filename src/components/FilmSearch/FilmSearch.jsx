import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const baseUrl = "https://phimimg.com/";

const Skeleton = () => (
    <div className="flex space-x-4 justify-between overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-[200px] h-[300px] bg-gray-300 rounded-md"></div>
                <div className="w-[150px] h-4 bg-gray-300 mt-3 rounded"></div>
            </div>
        ))}
    </div>
);
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
            <h2 className="mt-[100px] mb-[50px] font-bold text-4xl">Danh Sách Phim: {keyword}</h2>
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
                <Skeleton />
            )}
        </div>
    );
};

export default FilmSearch;

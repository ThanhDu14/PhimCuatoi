import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const baseUrl = "https://phimimg.com/";

const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-pulse">
        {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 px-1">
                <div className="w-full aspect-[2/3] bg-netflix-card rounded-md"></div>
                <div className="w-3/4 h-3 bg-netflix-card rounded"></div>
            </div>
        ))}
    </div>
);

const FilmSearch = () => {
    const { keyword } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const FetchApi = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}`);
                const result = await res.json();
                if (result && result.data && result.data.items) {
                    setData(result.data.items);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        if (keyword) FetchApi();
    }, [keyword]);

    const handleClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    return (
        <div className="bg-netflix-dark min-h-screen pt-28 px-4 md:px-12 pb-16 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold font-sans text-white mb-8 border-l-4 border-netflix-red pl-4">
                    Kết Quả Tìm Kiếm: <span className="text-netflix-red">"{keyword}"</span>
                </h2>
                
                {loading ? (
                    <Skeleton />
                ) : data.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-netflix-textGray text-lg md:text-xl font-medium mb-4">
                            Không tìm thấy phim nào khớp với từ khóa "{keyword}" 😭
                        </p>
                        <p className="text-sm text-netflix-textGray">
                            Sếp thử tìm với từ khóa khác xem sao nhé!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilmSearch;

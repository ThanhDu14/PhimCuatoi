import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaPlay } from 'react-icons/fa';

const baseUrl = "https://phimimg.com/";

const MyList = () => {
    const [myList, setMyList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedList = JSON.parse(localStorage.getItem('myMovieList')) || [];
        setMyList(storedList);
    }, []);

    const handleRemove = (slug, e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra thẻ cha
        const updatedList = myList.filter(movie => movie.slug !== slug);
        setMyList(updatedList);
        localStorage.setItem('myMovieList', JSON.stringify(updatedList));
    };

    const handlePlay = (slug) => {
        navigate(`/phim/${slug}`);
    };

    return (
        <div className="bg-netflix-dark min-h-screen pt-28 px-4 md:px-12 pb-12 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold font-sans text-white mb-8 border-l-4 border-netflix-red pl-4">
                    Danh Sách Của Tôi
                </h1>

                {myList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 p-8 bg-netflix-card rounded-lg border border-white/5 text-center">
                        <p className="text-netflix-textGray text-lg md:text-xl mb-6">
                            Danh sách yêu thích của Sếp đang trống trơn! 😲
                        </p>
                        <Link 
                            to="/" 
                            className="bg-netflix-red hover:bg-netflix-hoverRed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Khám Phá Phim Ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {myList.map((movie) => (
                            <div 
                                key={movie.slug} 
                                className="group relative bg-netflix-card rounded-lg overflow-hidden border border-white/5 cursor-pointer movie-card-hover"
                                onClick={() => handlePlay(movie.slug)}
                            >
                                {/* Thumbnail Image */}
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img 
                                        src={movie.poster_url.startsWith('http') ? movie.poster_url : `${baseUrl}${movie.poster_url}`} 
                                        alt={movie.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                        <div className="flex justify-end">
                                            <button 
                                                onClick={(e) => handleRemove(movie.slug, e)}
                                                className="bg-netflix-dark/80 hover:bg-netflix-red text-white p-2 rounded-full transition-colors duration-200"
                                                title="Xóa khỏi danh sách"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-col items-center justify-center mb-6">
                                            <div className="bg-netflix-red text-white p-3 rounded-full hover:scale-110 transition-transform duration-200">
                                                <FaPlay className="text-lg ml-0.5" />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="font-bold text-sm truncate">{movie.name}</p>
                                            <p className="text-xs text-netflix-textGray">{movie.year || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Info block visible on non-hover (mobile) */}
                                <div className="p-3 bg-netflix-card">
                                    <p className="font-semibold text-sm truncate group-hover:text-netflix-red transition-colors duration-200">
                                        {movie.name}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-netflix-textGray">{movie.year || 'Phim'}</span>
                                        <button 
                                            onClick={(e) => handleRemove(movie.slug, e)}
                                            className="text-netflix-textGray hover:text-netflix-red md:hidden p-1"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyList;

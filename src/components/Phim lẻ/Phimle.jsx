import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const baseUrl = "https://phimimg.com/";

const PhimLe = ({ isPage = false }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAPI = () => {
            setLoading(true);
            const url = isPage 
                ? `https://phimapi.com/v1/api/danh-sach/phim-le?page=${currentPage}&limit=24`
                : "https://phimapi.com/v1/api/danh-sach/phim-le";

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setData(data.data.items);
                    if (isPage && data.data.params?.pagination) {
                        setTotalPages(data.data.params.pagination.totalPages);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                    setLoading(false);
                });
        };

        fetchAPI();
    }, [currentPage, isPage]);

    const handleClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Cuộn lên đầu lưới phim mượt mà
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
        desktop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="w-10 h-10 rounded-md font-semibold text-sm transition-all duration-200 bg-netflix-card border border-white/10 text-netflix-textGray hover:bg-netflix-red hover:text-white hover:border-transparent"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="ell-1" className="text-netflix-textGray px-1 self-center">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-10 h-10 rounded-md font-semibold text-sm transition-all duration-200 ${
                        currentPage === i
                            ? "bg-netflix-red text-white border-transparent"
                            : "bg-netflix-card border border-white/10 text-netflix-textGray hover:bg-netflix-red hover:text-white hover:border-transparent"
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ell-2" className="text-netflix-textGray px-1 self-center">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="w-10 h-10 rounded-md font-semibold text-sm transition-all duration-200 bg-netflix-card border border-white/10 text-netflix-textGray hover:bg-netflix-red hover:text-white hover:border-transparent"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    if (isPage) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 min-h-[80vh]">
                <h1 className="text-2xl md:text-4xl font-black font-sans text-white mb-8 border-l-4 border-netflix-red pl-4 uppercase tracking-wider">
                    Kho Phim Lẻ Đặc Sắc
                </h1>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="flex flex-col animate-pulse">
                                <div className="w-full aspect-[2/3] bg-netflix-card rounded-lg"></div>
                                <div className="w-3/4 h-4 bg-netflix-card mt-3 rounded"></div>
                                <div className="w-1/2 h-3 bg-netflix-card mt-2 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {data.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="group relative bg-netflix-card rounded-lg overflow-hidden border border-white/5 cursor-pointer movie-card-hover pb-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                                    onClick={() => handleClick(item.slug)}
                                >
                                    <div className="aspect-[2/3] overflow-hidden relative">
                                        <img 
                                            src={`${baseUrl}${item.poster_url}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-2 left-2 bg-netflix-red/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            {item.quality || 'FHD'}
                                        </div>
                                    </div>
                                    <div className="p-2.5">
                                        <p className="font-bold text-sm text-white truncate group-hover:text-netflix-red transition-colors duration-200">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-netflix-textGray truncate">
                                            {item.origin_name} ({item.year})
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center gap-2 mt-12 pt-8 border-t border-white/5">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-netflix-card border border-white/10 rounded-md hover:bg-netflix-red hover:text-white hover:border-transparent transition-all duration-200 text-sm font-semibold disabled:opacity-40 disabled:hover:bg-netflix-card disabled:hover:text-netflix-textGray disabled:hover:border-white/10 text-netflix-textGray"
                                >
                                    Trang trước
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {renderPageNumbers()}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-netflix-card border border-white/10 rounded-md hover:bg-netflix-red hover:text-white hover:border-transparent transition-all duration-200 text-sm font-semibold disabled:opacity-40 disabled:hover:bg-netflix-card disabled:hover:text-netflix-textGray disabled:hover:border-white/10 text-netflix-textGray"
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="pt-8 pb-4">
            <h2 className="text-white font-bold text-xl md:text-2xl font-sans mb-6 border-l-4 border-netflix-red pl-3 tracking-wide">
                Phim Lẻ Hot Nhất
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

export default PhimLe;

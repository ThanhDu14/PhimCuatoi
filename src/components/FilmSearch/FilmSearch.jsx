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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Reset page to 1 when keyword changes
    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    useEffect(() => {
        let isMounted = true;
        const FetchApi = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&limit=24&page=${currentPage}`);
                const result = await res.json();
                if (isMounted) {
                    if (result && result.data && result.data.items) {
                        setData(result.data.items);
                        if (result.data.params?.pagination) {
                            setTotalPages(result.data.params.pagination.totalPages);
                        } else {
                            setTotalPages(1);
                        }
                    } else {
                        setData([]);
                        setTotalPages(1);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (keyword) FetchApi();

        return () => {
            isMounted = false;
        };
    }, [keyword, currentPage]);

    const handleClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Cuộn lên mượt mà
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

    return (
        <div className="bg-netflix-dark min-h-screen pt-28 px-4 md:px-12 pb-16 text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold font-sans text-white mb-8 border-l-4 border-netflix-red pl-4">
                    Kết Quả Tìm Kiếm: <span className="text-netflix-red">"{keyword}"</span>
                </h2>
                
                {loading ? (
                    <Skeleton />
                ) : data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-netflix-textGray text-lg md:text-xl font-medium mb-4">
                            Không tìm thấy phim nào khớp với từ khóa "{keyword}" 😭
                        </p>
                        <p className="text-sm text-netflix-textGray">
                            Bạn thử tìm với từ khóa khác xem sao nhé!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilmSearch;

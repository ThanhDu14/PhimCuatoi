import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaFilm, FaGlobe, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const baseUrl = "https://phimimg.com/";

const formats = [
    { label: "Phim Bộ", value: "phim-bo" },
    { label: "Phim Lẻ", value: "phim-le" },
    { label: "Hoạt Hình", value: "hoat-hinh" },
    { label: "TV Shows", value: "tv-shows" }
];

const genres = [
    { label: "Hành Động", value: "hanh-dong" },
    { label: "Tâm Lý", value: "tam-ly" },
    { label: "Tình Cảm", value: "tinh-cam" },
    { label: "Cổ Trang", value: "co-trang" },
    { label: "Viễn Tưởng", value: "vien-tuong" },
    { label: "Kinh Dị", value: "kinh-di" },
    { label: "Hài Hước", value: "hai-huoc" },
    { label: "Phiêu Lưu", value: "phieu-luu" },
    { label: "Võ Thuật", value: "vo-thuat" },
    { label: "Hình Sự", value: "hinh-su" }
];

const countries = [
    { label: "Hàn Quốc", value: "han-quoc" },
    { label: "Trung Quốc", value: "trung-quoc" },
    { label: "Âu Mỹ", value: "au-my" },
    { label: "Nhật Bản", value: "nhat-ban" },
    { label: "Thái Lan", value: "thai-lan" },
    { label: "Việt Nam", value: "viet-nam" },
    { label: "Ấn Độ", value: "an-do" }
];

const Discover = () => {
    const [filterGroup, setFilterGroup] = useState(() => {
        return sessionStorage.getItem('discover_filterGroup') || 'format';
    });
    const [selectedValue, setSelectedValue] = useState(() => {
        return sessionStorage.getItem('discover_selectedValue') || 'phim-bo';
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem('discover_page');
        return savedPage ? parseInt(savedPage, 10) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState(() => {
        return sessionStorage.getItem('discover_searchQuery') || '';
    });
    const navigate = useNavigate();

    // Sync state changes back to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('discover_filterGroup', filterGroup);
    }, [filterGroup]);

    useEffect(() => {
        sessionStorage.setItem('discover_selectedValue', selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        sessionStorage.setItem('discover_page', page.toString());
    }, [page]);

    useEffect(() => {
        sessionStorage.setItem('discover_searchQuery', searchQuery);
    }, [searchQuery]);

    // Reset selected value when filter group changes
    const handleGroupChange = (group) => {
        setFilterGroup(group);
        setPage(1);
        if (group === 'format') setSelectedValue(formats[0].value);
        if (group === 'genre') setSelectedValue(genres[0].value);
        if (group === 'country') setSelectedValue(countries[0].value);
    };

    const handleValueChange = (value) => {
        setSelectedValue(value);
        setPage(1);
    };

    useEffect(() => {
        const fetchFilteredFilms = async () => {
            setLoading(true);
            let url = '';
            
            if (filterGroup === 'format') {
                url = `https://phimapi.com/v1/api/danh-sach/${selectedValue}?page=${page}&limit=24`;
            } else if (filterGroup === 'genre') {
                url = `https://phimapi.com/v1/api/the-loai/${selectedValue}?page=${page}&limit=24`;
            } else if (filterGroup === 'country') {
                url = `https://phimapi.com/v1/api/quoc-gia/${selectedValue}?page=${page}&limit=24`;
            }

            try {
                const response = await fetch(url);
                const result = await response.json();
                if (result.status && result.data) {
                    setData(result.data.items || []);
                    if (result.data.params?.pagination) {
                        setTotalPages(result.data.params.pagination.totalPages || 1);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải phim lọc:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredFilms();
    }, [filterGroup, selectedValue, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFilmClick = (slug) => {
        navigate(`/phim/${slug}`);
    };

    // Filter items locally if user searches inside the results
    const displayedData = searchQuery.trim() === ''
        ? data
        : data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.origin_name.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const getActiveGroupPills = () => {
        if (filterGroup === 'format') return formats;
        if (filterGroup === 'genre') return genres;
        if (filterGroup === 'country') return countries;
        return [];
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - 2);
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
                        page === i
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 min-h-screen text-white">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black font-sans text-white border-l-4 border-netflix-red pl-4 uppercase tracking-wider">
                        Khám Phá Phim
                    </h1>
                    <p className="text-netflix-textGray text-sm mt-2 pl-4">
                        Sếp muốn tìm thể loại gì? Em lo tất!
                    </p>
                </div>

                {/* Inline filter search */}
                <div className="w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Lọc nhanh phim trong trang này..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-netflix-card border border-white/10 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all duration-200 text-white placeholder-netflix-textGray"
                    />
                </div>
            </div>

            {/* Filter Control Board */}
            <div className="bg-netflix-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 mb-8 space-y-6">
                
                {/* 1. Category Switcher */}
                <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
                    <span className="text-netflix-textGray font-bold text-xs uppercase tracking-wider mr-2 flex items-center gap-1.5">
                        <FaFilter className="text-netflix-red text-2xs" /> Lọc theo:
                    </span>
                    <button 
                        onClick={() => handleGroupChange('format')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-200 ${
                            filterGroup === 'format' 
                                ? 'bg-netflix-red text-white' 
                                : 'bg-white/5 text-netflix-textGray hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        Định Dạng
                    </button>
                    <button 
                        onClick={() => handleGroupChange('genre')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-200 ${
                            filterGroup === 'genre' 
                                ? 'bg-netflix-red text-white' 
                                : 'bg-white/5 text-netflix-textGray hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        Thể Loại
                    </button>
                    <button 
                        onClick={() => handleGroupChange('country')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-200 ${
                            filterGroup === 'country' 
                                ? 'bg-netflix-red text-white' 
                                : 'bg-white/5 text-netflix-textGray hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        Quốc Gia
                    </button>
                </div>

                {/* 2. Specific selection pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {getActiveGroupPills().map((pill) => (
                        <button
                            key={pill.value}
                            onClick={() => handleValueChange(pill.value)}
                            className={`px-4.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border transform active:scale-95 ${
                                selectedValue === pill.value
                                    ? 'bg-white text-black border-white font-bold shadow-lg'
                                    : 'bg-transparent text-netflix-textGray border-white/10 hover:text-white hover:border-white/30'
                            }`}
                        >
                            {pill.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
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
            ) : displayedData.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {displayedData.map((item, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-netflix-card rounded-lg overflow-hidden border border-white/5 cursor-pointer movie-card-hover pb-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                                onClick={() => handleFilmClick(item.slug)}
                            >
                                <div className="aspect-[2/3] overflow-hidden relative">
                                    <img 
                                        src={`${baseUrl}${item.poster_url}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {item.year && (
                                        <div className="absolute top-2 left-2 bg-netflix-red/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            {item.year}
                                        </div>
                                    )}
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

                    {/* Pagination */}
                    {totalPages > 1 && searchQuery.trim() === '' && (
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-12 pt-8 border-t border-white/5">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 bg-netflix-card border border-white/10 rounded-md hover:bg-netflix-red hover:text-white hover:border-transparent transition-all duration-200 text-sm font-semibold disabled:opacity-40 disabled:hover:bg-netflix-card disabled:hover:text-netflix-textGray disabled:hover:border-white/10 text-netflix-textGray"
                            >
                                Trang trước
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {renderPageNumbers()}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-netflix-card border border-white/10 rounded-md hover:bg-netflix-red hover:text-white hover:border-transparent transition-all duration-200 text-sm font-semibold disabled:opacity-40 disabled:hover:bg-netflix-card disabled:hover:text-netflix-textGray disabled:hover:border-white/10 text-netflix-textGray"
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-netflix-card rounded-2xl border border-white/5">
                    <p className="text-netflix-textGray text-lg font-medium">Không tìm thấy bộ phim nào phù hợp với bộ lọc.</p>
                    <button 
                        onClick={() => { setSearchQuery(''); setPage(1); }}
                        className="mt-4 bg-netflix-red text-white text-xs font-bold px-4 py-2 rounded uppercase hover:bg-netflix-hoverRed transition-all"
                    >
                        Đặt lại tìm kiếm
                    </button>
                </div>
            )}
        </div>
    );
};

export default Discover;

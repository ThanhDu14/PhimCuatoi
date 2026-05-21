import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaCheck, FaPlay, FaFilm, FaHeart, FaRegClock, FaGlobe, FaCalendarAlt } from 'react-icons/fa';

const Skeleton = () => (
    <div className="bg-netflix-dark min-h-screen pt-28 px-4 md:px-12 animate-pulse space-y-8">
        <div className="h-[40vh] bg-netflix-card rounded-xl w-full"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
                <div className="aspect-[2/3] bg-netflix-card rounded-lg w-full"></div>
            </div>
            <div className="md:col-span-3 space-y-6">
                <div className="h-10 bg-netflix-card rounded w-3/4"></div>
                <div className="h-4 bg-netflix-card rounded w-1/4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-netflix-card rounded w-full"></div>
                    <div className="h-4 bg-netflix-card rounded w-5/6"></div>
                    <div className="h-4 bg-netflix-card rounded w-2/3"></div>
                </div>
            </div>
        </div>
    </div>
);

const FilmInfo = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInList, setIsInList] = useState(false);
    const [currentEpUrl, setCurrentEpUrl] = useState('');
    const [currentEpName, setCurrentEpName] = useState('');

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await fetch(`https://phimapi.com/phim/${slug}`);
                const result = await response.json();

                if (result && result.movie) {
                    setData(result);
                    // Check if already in My List
                    const storedList = JSON.parse(localStorage.getItem('myMovieList')) || [];
                    const found = storedList.some(item => item.slug === result.movie.slug);
                    setIsInList(found);

                    // Set default episode
                    const episodes = result.episodes?.[0]?.server_data || [];
                    if (episodes.length > 0) {
                        setCurrentEpUrl(episodes[0].link_embed);
                        setCurrentEpName(episodes[0].name);
                    }
                } else {
                    setError("Không tìm thấy phim.");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu phim.");
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, [slug]);

    const toggleMyList = () => {
        if (!data || !data.movie) return;
        const storedList = JSON.parse(localStorage.getItem('myMovieList')) || [];
        if (isInList) {
            const updatedList = storedList.filter(item => item.slug !== data.movie.slug);
            localStorage.setItem('myMovieList', JSON.stringify(updatedList));
            setIsInList(false);
        } else {
            const movieToSave = {
                slug: data.movie.slug,
                name: data.movie.name,
                poster_url: data.movie.poster_url,
                year: data.movie.year
            };
            storedList.push(movieToSave);
            localStorage.setItem('myMovieList', JSON.stringify(storedList));
            setIsInList(true);
        }
    };

    if (loading) {
        return <Skeleton />;
    }

    if (error) {
        return (
            <div className="bg-netflix-dark min-h-screen pt-32 text-center text-netflix-red text-xl font-semibold">
                {error}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-netflix-dark min-h-screen pt-32 text-center text-netflix-textGray text-xl font-semibold">
                Không có dữ liệu phim.
            </div>
        );
    }

    const { name, origin_name, poster_url, thumb_url, content, lang, year, time, quality, actor, director, category, country } = data.movie;
    const episodeList = data.episodes?.[0]?.server_data || [];

    const handleEpisodeClick = (ep) => {
        setCurrentEpUrl(ep.link_embed);
        setCurrentEpName(ep.name);

        // Scroll mượt đến trình phát video
        const playerElement = document.getElementById('video-player');
        if (playerElement) {
            playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="bg-netflix-dark min-h-screen pb-24 text-white">

            {/* Backdrop Banner section */}
            <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-xs"
                    style={{ backgroundImage: `url(${thumb_url || poster_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/40 to-black/60 z-10" />

                {/* Visual fading overlays */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-8 pb-8">
                    <h1 className="text-3xl md:text-5xl font-black font-sans tracking-wide mb-2 max-w-3xl drop-shadow-md">
                        {name}
                    </h1>
                    <p className="text-netflix-textGray text-sm md:text-lg font-medium drop-shadow-md">
                        {origin_name} ({year})
                    </p>
                </div>
            </div>

            {/* Movie Info Grid details */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">

                {/* Left Card: Poster */}
                <div className="lg:col-span-2">
                    <div className="relative group max-w-sm mx-auto rounded-lg overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-102">
                        <img
                            src={poster_url}
                            alt={name}
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-netflix-red text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                            {quality || 'HD'}
                        </div>
                    </div>
                </div>

                {/* Right Card: Metadata */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-netflix-textGray items-center">
                        <span className="flex items-center space-x-1 text-white">
                            <FaCalendarAlt className="text-netflix-red" />
                            <span>Năm: {year}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-white">
                            <FaRegClock className="text-netflix-red" />
                            <span>Thời lượng: {time || 'Đang cập nhật'}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-white">
                            <FaGlobe className="text-netflix-red" />
                            <span>Ngôn ngữ: {lang}</span>
                        </span>
                    </div>

                    {/* Actions button (Add to list / Play first) */}
                    <div className="flex items-center space-x-4">
                        {episodeList.length > 0 && (
                            <button
                                onClick={() => handleEpisodeClick(episodeList[0])}
                                className="flex items-center space-x-2 bg-netflix-red hover:bg-netflix-hoverRed text-white font-bold px-6 py-3 rounded-md transition duration-200 transform active:scale-95 shadow-lg"
                            >
                                <FaPlay className="text-sm" />
                                <span>Xem Ngay</span>
                            </button>
                        )}
                        <button
                            onClick={toggleMyList}
                            className={`flex items-center space-x-2 border font-bold px-5 py-3 rounded-md transition duration-200 transform active:scale-95 shadow-md ${isInList
                                ? "bg-white text-black border-white hover:bg-white/80"
                                : "bg-transparent text-white border-white/30 hover:bg-white/10"
                                }`}
                        >
                            {isInList ? <FaCheck className="text-sm" /> : <FaPlus className="text-sm" />}
                            <span>{isInList ? "Đã Lưu vào List" : "Lưu vào List"}</span>
                        </button>
                    </div>

                    {/* Synopsis & Details */}
                    <div className="bg-netflix-card border border-white/5 rounded-xl p-6 space-y-4">
                        <div className="border-b border-white/5 pb-3">
                            <h3 className="text-sm text-netflix-textGray font-bold uppercase tracking-wider mb-1">Cốt truyện</h3>
                            <p className="text-sm leading-relaxed text-white/90 font-light">
                                {content || "Chưa có cốt truyện chi tiết cho bộ phim này."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                            <div>
                                <p className="text-netflix-textGray mb-0.5">Thể loại</p>
                                <p className="text-white">{category?.map(c => c.name).join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-netflix-textGray mb-0.5">Quốc gia</p>
                                <p className="text-white">{country?.map(c => c.name).join(', ') || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-netflix-textGray mb-0.5">Đạo diễn</p>
                                <p className="text-white">{director?.join(', ') || 'Đang cập nhật'}</p>
                            </div>
                            <div>
                                <p className="text-netflix-textGray mb-0.5">Diễn viên</p>
                                <p className="text-white truncate" title={actor?.join(', ')}>
                                    {actor?.slice(0, 5).join(', ') || 'Đang cập nhật'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player section */}
            {currentEpUrl ? (
                <div id="video-player" className="max-w-7xl mx-auto px-4 md:px-8 mt-16 space-y-6">
                    <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                        <FaFilm className="text-netflix-red text-2xl" />
                        <h2 className="text-xl md:text-2xl font-black font-sans">
                            Đang xem: <span className="text-netflix-red">{currentEpName || 'Tập phim'}</span>
                        </h2>
                    </div>

                    {/* Embed Frame with Ambient Glow */}
                    <div className="relative max-w-5xl mx-auto group">
                        {/* Lớp Đèn Nền Ambient Light tỏa sáng phía sau */}
                        <div
                            className="absolute inset-0 -z-10 bg-cover bg-center rounded-2xl opacity-40 scale-105 select-none pointer-events-none transition-all duration-1000 animate-pulse-ambient"
                            style={{ backgroundImage: `url(${thumb_url || poster_url})` }}
                        />

                        {/* Player Container */}
                        <div className="w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video-cinematic">
                            <iframe
                                src={currentEpUrl}
                                title={`Xem phim ${name}`}
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                                scrolling="no"
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                            />
                        </div>
                    </div>

                    {/* Episode Grid select */}
                    {episodeList.length > 1 && (
                        <div className="bg-netflix-card border border-white/5 rounded-xl p-6 max-w-5xl mx-auto mt-6">
                            <h3 className="text-lg font-bold font-sans text-white mb-4 border-l-4 border-netflix-red pl-2">
                                Chọn tập phim khác:
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {episodeList.map((ep, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEpisodeClick(ep)}
                                        className={`py-2 px-3 rounded text-center text-sm font-semibold transition duration-200 transform active:scale-95 ${currentEpUrl === ep.link_embed
                                            ? "bg-netflix-red text-white shadow-lg"
                                            : "bg-netflix-lightCard/60 hover:bg-netflix-lightCard text-netflix-textGray hover:text-white"
                                            }`}
                                    >
                                        Tập {ep.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
                    <div className="bg-netflix-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center max-w-3xl mx-auto shadow-xl">
                        <FaFilm className="text-netflix-red/60 text-5xl mx-auto mb-4 animate-pulse" />
                        <h3 className="text-xl font-extrabold text-white mb-2">🤵  Phim Này Chưa Có Video Thuyết Minh!</h3>
                        <p className="text-sm text-netflix-textGray max-w-md mx-auto leading-relaxed">
                            Hiện tại phim này đang ở trạng thái thông tin (hoặc phim chiếu rạp mới cập nhật) nên API nguồn chưa cung cấp link xem trực tuyến. Bạn vui lòng thử lại sau hoặc chọn một cực phẩm khác để thưởng thức nhé!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilmInfo;
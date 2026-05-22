import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaDice, FaTimes, FaPlay, FaRedo, 
    FaFire, FaRocket, FaGhost, FaLaughBeam, 
    FaHeart, FaDragon, FaFilm, FaTv, 
    FaChild, FaCompass 
} from 'react-icons/fa';

// Fallback movies in case API is slow or offline
const FALLBACK_MOVIES = [
    {
        name: "Lật Mặt 7: Một Điều Ước",
        origin_name: "Face Off 7: One Wish",
        slug: "lat-mat-7-mot-dieu-uoc",
        thumb_url: "https://phimimg.com/upload/film/lat-mat-7-mot-dieu-uoc.jpg",
        year: 2024
    },
    {
        name: "Mai",
        origin_name: "Mai",
        slug: "mai",
        thumb_url: "https://phimimg.com/upload/film/mai.jpg",
        year: 2024
    },
    {
        name: "Nhà Bà Nữ",
        origin_name: "The House of No Man",
        slug: "nha-ba-nu",
        thumb_url: "https://phimimg.com/upload/film/nha-ba-nu.jpg",
        year: 2023
    },
    {
        name: "Đất Rừng Phương Nam",
        origin_name: "Song of the South",
        slug: "dat-rung-phuong-nam",
        thumb_url: "https://phimimg.com/upload/film/dat-rung-phuong-nam.jpg",
        year: 2023
    },
    {
        name: "Kẻ Kiến Tạo",
        origin_name: "The Creator",
        slug: "ke-kien-tao",
        thumb_url: "https://phimimg.com/upload/film/ke-kien-tao.jpg",
        year: 2023
    }
];

const CATEGORIES = [
    { id: 'all', label: 'Tất cả mới nhất', type: 'all', api: 'https://phimapi.com/danh-sach/phim-moi-cap-nhat', icon: FaCompass, color: 'from-blue-600/30 to-indigo-600/10' },
    { id: 'phim-le', label: 'Phim Lẻ', type: 'format', api: 'https://phimapi.com/v1/api/danh-sach/phim-le', icon: FaFilm, color: 'from-red-600/30 to-pink-600/10' },
    { id: 'phim-bo', label: 'Phim Bộ', type: 'format', api: 'https://phimapi.com/v1/api/danh-sach/phim-bo', icon: FaTv, color: 'from-amber-600/30 to-orange-600/10' },
    { id: 'hoat-hinh', label: 'Hoạt Hình', type: 'format', api: 'https://phimapi.com/v1/api/danh-sach/hoat-hinh', icon: FaChild, color: 'from-green-600/30 to-emerald-600/10' },
    { id: 'hanh-dong', label: 'Hành Động', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/hanh-dong', icon: FaFire, color: 'from-red-700/30 to-orange-700/10' },
    { id: 'vien-tuong', label: 'Viễn Tưởng', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/vien-tuong', icon: FaRocket, color: 'from-purple-600/30 to-blue-600/10' },
    { id: 'kinh-di', label: 'Kinh Dị', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/kinh-di', icon: FaGhost, color: 'from-stone-700/30 to-red-950/10' },
    { id: 'hai-huoc', label: 'Hài Hước', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/hai-huoc', icon: FaLaughBeam, color: 'from-yellow-500/30 to-amber-500/10' },
    { id: 'tinh-cam', label: 'Tình Cảm', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/tinh-cam', icon: FaHeart, color: 'from-pink-600/30 to-rose-600/10' },
    { id: 'co-trang', label: 'Cổ Trang', type: 'genre', api: 'https://phimapi.com/v1/api/the-loai/co-trang', icon: FaDragon, color: 'from-yellow-700/30 to-red-800/10' },
];

const MovieShuffle = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle' | 'spinning' | 'revealed'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [winner, setWinner] = useState(null);
    const [countdown, setCountdown] = useState(4);
    const [tickDuration, setTickDuration] = useState(60);

    const timeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // Mechanical click sound effect via Web Audio API
    const playTickSound = () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.06);
        } catch (e) {
            // Browser autoplay restrictions might block audio occasionally
        }
    };

    // Chime chord sound effect for the winner reveal
    const playRevealSound = () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            
            const chord = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
            chord.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + idx * 0.08 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + idx * 0.08);
                osc.stop(ctx.currentTime + idx * 0.08 + 0.8);
            });
        } catch (e) {
            // Ignore audio issues
        }
    };

    // Start slot machine spin
    const startSpin = (movieList) => {
        if (!movieList || movieList.length === 0) return;
        
        // Clean up any existing timeouts/intervals
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        setStatus('spinning');
        setWinner(null);
        setCountdown(4);

        let currentIdx = Math.floor(Math.random() * movieList.length);
        setCurrentIndex(currentIdx);

        let delay = 50; // Initial fast speed
        const targetSteps = 36 + Math.floor(Math.random() * 5); // 36 to 40 spins
        let step = 0;

        const tick = () => {
            playTickSound();
            currentIdx = (currentIdx + 1) % movieList.length;
            setCurrentIndex(currentIdx);
            
            step++;
            if (step < targetSteps) {
                // Deceleration curve
                delay = delay + (step * 0.2) + (delay * 0.045);
                setTickDuration(delay);
                timeoutRef.current = setTimeout(tick, delay);
            } else {
                // Reel stops! Reveal selected movie
                const finalMovie = movieList[currentIdx];
                setWinner(finalMovie);
                setStatus('revealed');
                playRevealSound();
            }
        };

        timeoutRef.current = setTimeout(tick, delay);
    };

    // Handle selecting a category and fetching movies
    const handleSelectCategory = async (category) => {
        setSelectedCategory(category);
        setLoading(true);
        setStatus('idle');
        setWinner(null);
        setCountdown(4);
        setMovies([]);

        try {
            let url = category.api;
            // Fetch from a random page (between 1 and 3) for category types to get varied content
            if (category.type !== 'all') {
                const randomPage = Math.floor(Math.random() * 3) + 1;
                url = `${category.api}?page=${randomPage}&limit=30`;
            } else {
                url = `${category.api}?page=1`;
            }

            const response = await fetch(url);
            const result = await response.json();

            let rawItems = [];
            if (category.type === 'all') {
                rawItems = result.items || [];
            } else {
                rawItems = (result.data && result.data.items) || [];
            }

            if (rawItems.length > 0) {
                const validMovies = rawItems.map(item => {
                    let thumb = item.thumb_url || item.poster_url;
                    if (thumb && !thumb.startsWith('http')) {
                        thumb = `https://phimimg.com/${thumb}`;
                    }
                    return {
                        name: item.name,
                        origin_name: item.origin_name,
                        slug: item.slug,
                        thumb_url: thumb || "https://phimimg.com/upload/film/lat-mat-7-mot-dieu-uoc.jpg",
                        year: item.year
                    };
                });
                setMovies(validMovies);
                setCurrentIndex(Math.floor(Math.random() * validMovies.length));
                // Automatically start spin after loading
                startSpin(validMovies);
            } else {
                setMovies(FALLBACK_MOVIES);
                setCurrentIndex(Math.floor(Math.random() * FALLBACK_MOVIES.length));
                startSpin(FALLBACK_MOVIES);
            }
        } catch (error) {
            console.error("Lỗi khi tải phim cho Vòng quay:", error);
            setMovies(FALLBACK_MOVIES);
            setCurrentIndex(Math.floor(Math.random() * FALLBACK_MOVIES.length));
            startSpin(FALLBACK_MOVIES);
        } finally {
            setLoading(false);
        }
    };

    // Reset state and clear timers when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setWinner(null);
            setCountdown(4);
            setSelectedCategory(null);
            setMovies([]);
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setStatus('idle');
            setWinner(null);
            setCountdown(4);
            setSelectedCategory(null);
            setMovies([]);
        }
    }, [isOpen]);

    // Handle countdown after reveal
    useEffect(() => {
        if (isOpen && status === 'revealed' && winner) {
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        navigate(`/phim/${winner.slug}`);
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [isOpen, status, winner, navigate, onClose]);

    // Clean up timers on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200 z-50 hover:rotate-90"
                aria-label="Đóng Vòng Quay"
            >
                <FaTimes className="text-xl" />
            </button>

            {/* Glowing background aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-netflix-red/10 blur-[80px] pointer-events-none animate-pulse-ambient" />

            <div className={`z-10 text-center px-4 flex flex-col items-center w-full transition-all duration-300 ${selectedCategory ? 'max-w-md' : 'max-w-2xl'}`}>
                {/* Title */}
                <div className="mb-6 flex items-center justify-center space-x-2">
                    <FaDice className="text-netflix-red text-3xl animate-bounce" />
                    <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]">
                        XEM ĐẠI ĐI!
                    </h2>
                </div>

                {!selectedCategory ? (
                    /* Category Selection Grid */
                    <div className="w-full bg-netflix-card/50 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in">
                        <p className="text-netflix-textGray text-sm mb-6 font-medium">
                            🤵 Chọn một thể loại hoặc định dạng phim bạn thích, mình sẽ quay ngẫu nhiên cho bạn nhé!
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelectCategory(cat)}
                                        className={`relative group overflow-hidden bg-gradient-to-br ${cat.color} hover:from-netflix-red/30 hover:to-netflix-red/10 border border-white/5 hover:border-netflix-red/40 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md`}
                                    >
                                        <div className="bg-white/5 group-hover:bg-netflix-red/20 p-2.5 rounded-full transition-colors duration-300">
                                            <Icon className="text-xl md:text-2xl text-white group-hover:text-netflix-red transition-colors duration-300" />
                                        </div>
                                        <span className="text-xs font-bold text-white tracking-wide text-center">
                                            {cat.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Slot Machine Reel Container */
                    <div className="flex flex-col items-center w-full">
                        {/* Selected Category Tag */}
                        <div className="mb-4 flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-netflix-textGray">
                            <span>Đang lọc:</span>
                            <span className="text-netflix-red uppercase tracking-wider">{selectedCategory.label}</span>
                        </div>

                        {/* Butler Message */}
                        <div className="mb-6 bg-netflix-card/80 border border-white/5 px-4 py-2.5 rounded-lg max-w-sm shadow-md">
                            <p className="text-sm font-medium text-netflix-textGray">
                                {status === 'idle' && loading && "🤵 Đang chuẩn bị các bộ phim cực phẩm cho bạn..."}
                                {status === 'idle' && !loading && "🤵 Để mình chọn ngẫu nhiên một phim cực phẩm cho bạn nhé..."}
                                {status === 'spinning' && "🤵 Vòng quay đang chạy... Cùng chờ xem phim gì nhé!"}
                                {status === 'revealed' && "🤵 Tuyệt vời! Bộ phim này rất đáng xem đấy!"}
                            </p>
                        </div>

                        {loading ? (
                            <div className="w-80 md:w-96 h-[260px] bg-netflix-card rounded-xl border border-white/10 flex items-center justify-center shadow-lg">
                                <div className="text-netflix-red font-bold text-lg animate-pulse">
                                    Đang chuẩn bị phim mới...
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-80 md:w-96 h-[260px] overflow-hidden bg-netflix-card rounded-xl border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center">
                                
                                {/* Shadow Overlays */}
                                <div className="absolute top-0 left-0 w-full h-14 bg-gradient-to-b from-netflix-card via-netflix-card/60 to-transparent pointer-events-none z-20" />
                                <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-netflix-card via-netflix-card/60 to-transparent pointer-events-none z-20" />

                                {/* Neon Target Frame */}
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[150px] border-y-2 border-netflix-red shadow-[0_0_20px_rgba(229,9,20,0.6)] bg-netflix-red/5 pointer-events-none z-20 flex items-center justify-between px-2">
                                    <div className="w-1.5 h-6 bg-netflix-red rounded-r-md"></div>
                                    <div className="w-1.5 h-6 bg-netflix-red rounded-l-md"></div>
                                </div>

                                {/* Reel Wrapper */}
                                <div 
                                    className="flex flex-col items-center w-full"
                                    style={{
                                        transform: `translateY(${-currentIndex * 150 + 55}px)`,
                                        transitionProperty: 'transform',
                                        transitionDuration: status === 'spinning' ? `${tickDuration}ms` : '400ms',
                                        transitionTimingFunction: status === 'spinning' ? 'linear' : 'ease-out',
                                        height: `${movies.length * 150}px`
                                    }}
                                >
                                    {movies.map((movie, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`h-[150px] flex items-center px-4 w-full transition-all duration-300 ${
                                                idx === currentIndex ? 'scale-105 opacity-100' : 'scale-90 opacity-30 blur-[0.5px]'
                                            }`}
                                        >
                                            <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded-md border border-white/10 shadow-md">
                                                <img 
                                                    src={movie.thumb_url} 
                                                    alt={movie.name} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://phimimg.com/upload/film/lat-mat-7-mot-dieu-uoc.jpg";
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4 flex-1 text-left">
                                                <h3 className="font-bold text-white text-base line-clamp-2 leading-tight">
                                                    {movie.name}
                                                </h3>
                                                <p className="text-xs text-netflix-textGray truncate mt-1">
                                                    {movie.origin_name}
                                                </p>
                                                <span className="text-[10px] bg-white/10 text-white font-bold px-2 py-0.5 rounded mt-2 inline-block">
                                                    {movie.year || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Final Winner Controls and Countdown */}
                        {status === 'revealed' && winner && (
                            <div className="mt-8 flex flex-col items-center w-full animate-fade-in">
                                <div className="text-netflix-red font-black text-sm tracking-widest uppercase mb-4 animate-pulse">
                                    🚀 Chuẩn bị chuyển đến trang xem phim sau {countdown}s...
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <button
                                        onClick={() => navigate(`/phim/${winner.slug}`)}
                                        className="flex items-center space-x-2 bg-white text-black font-bold px-6 py-2.5 rounded-full hover:bg-white/80 transition-all duration-200 text-sm shadow-lg transform active:scale-95"
                                    >
                                        <FaPlay className="text-xs" />
                                        <span>Xem Ngay</span>
                                    </button>

                                    <button
                                        onClick={() => startSpin(movies)}
                                        className="flex items-center space-x-2 bg-netflix-lightCard hover:bg-netflix-lightCard/80 border border-white/10 text-white font-bold px-5 py-2.5 rounded-full transition-all duration-200 text-sm shadow-lg transform active:scale-95"
                                    >
                                        <FaRedo className="text-xs" />
                                        <span>Quay Lại</span>
                                    </button>

                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-5 py-2.5 rounded-full transition-all duration-200 text-sm shadow-lg transform active:scale-95"
                                    >
                                        <span>Thể Loại Khác</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Standard back link if not revealed yet and not loading */}
                        {status !== 'revealed' && !loading && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mt-6 text-xs text-netflix-textGray hover:text-white underline transition-colors"
                            >
                                Chọn thể loại khác
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieShuffle;

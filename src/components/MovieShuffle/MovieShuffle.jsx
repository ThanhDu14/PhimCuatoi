import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDice, FaTimes, FaPlay, FaRedo } from 'react-icons/fa';

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

const MovieShuffle = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('idle'); // 'idle' | 'spinning' | 'revealed'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [winner, setWinner] = useState(null);
    const [countdown, setCountdown] = useState(4);
    const [tickDuration, setTickDuration] = useState(60);

    const timeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // Fetch movies when component mounts
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1");
                const result = await response.json();
                if (result.items && result.items.length > 0) {
                    // Filter movies with valid slugs and images
                    const validMovies = result.items.map(item => ({
                        name: item.name,
                        origin_name: item.origin_name,
                        slug: item.slug,
                        thumb_url: item.thumb_url || item.poster_url,
                        year: item.year
                    }));
                    setMovies(validMovies);
                } else {
                    setMovies(FALLBACK_MOVIES);
                }
            } catch (error) {
                console.error("Lỗi khi tải phim cho Vòng quay:", error);
                setMovies(FALLBACK_MOVIES);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

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
        const targetSteps = 36 + Math.floor(Math.random() * 5); // 36 to 40 spins (averaging 38, ~7 seconds total)
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

    // Reset state and clear timers when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setWinner(null);
            setCountdown(4);
            if (movies.length > 0) {
                setCurrentIndex(Math.floor(Math.random() * movies.length));
            }
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
    }, [isOpen, movies.length]);

    // Auto-spin on open
    useEffect(() => {
        if (isOpen && movies.length > 0) {
            // A short delay of 600ms to let the user settle in before reel starts spinning
            const initialTimer = setTimeout(() => {
                startSpin(movies);
            }, 600);
            return () => clearTimeout(initialTimer);
        }
    }, [isOpen, movies]);

    // Handle countdown after reveal
    useEffect(() => {
        if (status === 'revealed' && winner) {
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
    }, [status, winner, navigate, onClose]);

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

            <div className="z-10 text-center max-w-md px-4 flex flex-col items-center">
                {/* Title */}
                <div className="mb-4 flex items-center justify-center space-x-2">
                    <FaDice className="text-netflix-red text-3xl animate-bounce" />
                    <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]">
                        XEM ĐẠI ĐI!
                    </h2>
                </div>

                {/* Butler Message */}
                <div className="mb-8 bg-netflix-card/80 border border-white/5 px-4 py-2.5 rounded-lg max-w-sm shadow-md">
                    <p className="text-sm font-medium text-netflix-textGray">
                        {status === 'idle' && "🤵 Dạ, để em chọn đại một phim cực phẩm cho Sếp nhé..."}
                        {status === 'spinning' && "🤵 Vòng quay đang chạy cực sung... Cầu nguyện đi Đại Gia!"}
                        {status === 'revealed' && "🤵 Tuyệt cú mèo! Bộ này siêu đỉnh luôn Sếp ơi!"}
                    </p>
                </div>

                {/* Slot Machine Reel Container */}
                {loading ? (
                    <div className="w-80 md:w-96 h-[300px] bg-netflix-card rounded-xl border border-white/10 flex items-center justify-center">
                        <div className="text-netflix-red font-bold text-lg animate-pulse">
                            Đang chuẩn bị máy xèng...
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
                            🚀 Chuẩn bị đưa Sếp đi xem phim sau {countdown}s...
                        </div>

                        <div className="flex items-center space-x-4">
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieShuffle;

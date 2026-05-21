import { CiSearch } from "react-icons/ci";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import logo from "../../assets/Logocuatoi.jpg";
import { FaBars, FaTimes, FaFilm } from "react-icons/fa";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim() !== "") {
            navigate(`/search/${searchTerm}`);
            setSearchTerm("");
            setIsSearchVisible(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const closeAll = () => {
        setIsMenuOpen(false);
        setIsSearchVisible(false);
    };

    const navLinks = [
        { path: "/", label: "Trang chủ" },
        { path: "/phim-bo", label: "Phim Bộ" },
        { path: "/phim-le", label: "Phim Lẻ" },
        { path: "/my-list", label: "Danh sách của tôi" }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? "bg-netflix-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2" 
                    : "bg-gradient-to-b from-black/80 to-transparent py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                
                {/* Logo and Nav Links */}
                <div className="flex items-center space-x-10">
                    <Link to="/" className="flex items-center space-x-2" onClick={closeAll}>
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="h-10 md:h-12 w-auto rounded-md shadow-md border border-white/10 transition-transform duration-300 hover:scale-105" 
                        />
                        <span className="hidden sm:inline-block text-lg font-black tracking-wider text-white">
                            PHIM<span className="text-netflix-red">CUATOI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
                                    isActive(link.path) 
                                        ? "text-netflix-red font-bold" 
                                        : "text-netflix-textGray"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Search Bar & Actions */}
                <div className="flex items-center space-x-4">
                    {/* Search Component */}
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim..."
                            className={`transition-all duration-300 bg-black/60 text-white placeholder-netflix-textGray text-sm rounded-full pl-4 pr-10 py-1.5 border border-white/20 focus:border-netflix-red focus:outline-none focus:ring-1 focus:ring-netflix-red ${
                                isSearchVisible 
                                    ? "w-40 sm:w-60 opacity-100 scale-100" 
                                    : "w-0 opacity-0 scale-95 pointer-events-none"
                            }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <button 
                            type="button" 
                            onClick={toggleSearch} 
                            className={`p-2 rounded-full hover:bg-white/10 transition-colors duration-200 ${
                                isSearchVisible ? "absolute right-1 text-netflix-red" : "text-white"
                            }`}
                        >
                            <CiSearch className="text-2xl font-bold" />
                        </button>
                    </form>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMenu} 
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Navigation */}
            <div 
                className={`fixed inset-x-0 top-[60px] bg-netflix-dark/95 backdrop-blur-lg border-b border-white/10 shadow-2xl md:hidden transition-all duration-300 overflow-hidden ${
                    isMenuOpen ? "max-h-[300px] opacity-100 py-4" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <ul className="flex flex-col space-y-4 px-6">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                onClick={closeAll}
                                className={`block py-2 text-base font-semibold border-b border-white/5 transition-colors ${
                                    isActive(link.path) 
                                        ? "text-netflix-red" 
                                        : "text-white/80 hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}

export default Header;
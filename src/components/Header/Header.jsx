import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import logo from "../../assets/Logocuatoi.jpg";
import { FaBars, FaTimes } from "react-icons/fa"; // Thêm biểu tượng menu và đóng

function Header() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State để quản lý trạng thái menu
    const [isSearchVisible, setIsSearchVisible] = useState(false); // State để quản lý trạng thái hiển thị ô tìm kiếm

    const handleSubmit = (event) => {
        event.preventDefault();

        if (searchTerm.trim() !== "") {
            navigate(`/search/${searchTerm}`); 
            setSearchTerm("");  
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };
    const toggleMenuFalse = () => {
        setIsMenuOpen(false);
    }
    const toggleSearchFalse = () => {  
        setIsSearchVisible(false);
    }
    return (
        <div className="bg-[#FEFEFE] z-[9999]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <div className="Logo">
                        <Link to="/">
                            <img src={logo} alt="Logo-dethuong" className="w-[100px] h-[100px]" />
                        </Link>
                    </div>
                    <div className="md:hidden flex items-center space-x-4">
                        <button onClick={toggleSearch}>
                            <CiSearch color="red" className="font-bold text-red-500 text-2xl cursor-pointer" />
                        </button>
                        <button onClick={toggleMenu}>
                            {isMenuOpen ? <FaTimes className="text-black text-2xl" /> : <FaBars className="text-black text-2xl" />}
                        </button>
                    </div>
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center`}>
                        <ul className="flex flex-col md:flex-row md:space-x-4">
                            <li className="p-2 text-black hover:text-red-500" onClick={toggleMenuFalse}><Link to="/">Trang chủ</Link></li>
                            <li className="p-2 text-black hover:text-red-500" onClick={toggleMenuFalse}><Link to="/phim-bo">Phim Bộ</Link></li>
                            <li className="p-2 text-black hover:text-red-500" onClick={toggleMenuFalse}><Link to="/phim-le">Phim lẻ</Link></li>
                            <li className="p-2 text-black hover:text-red-500" onClick={toggleMenuFalse}><Link to="/my-list">Danh sách của tôi</Link></li>
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit} className={`${isSearchVisible ? 'block' : 'hidden'} md:flex items-center`}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="border border-red-500 p-2 bg-black text-white placeholder-gray-500 rounded-[35px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <button type="submit" onClick={toggleSearchFalse}>
                            <CiSearch color="red" className="font-bold text-red-500 ml-2 cursor-pointer" />
                        </button>
                    </form> 
                </div>
            </div>
        </div>
    );
}

export default Header;
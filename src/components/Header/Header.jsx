import logo from '../../assets/Logo.jpg';
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function Header() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (searchTerm.trim() !== "") {
            console.log("Từ khóa tìm kiếm:", searchTerm);
            navigate(`/search/${searchTerm}`); 
            setSearchTerm("");  
        }
    };
    
    return (
        <div className="bg-[#101010] z-[9999]">
            <div className="container">
                <div className="flex items-center justify-between ml-5 text-white">
                    <div className="Logo">
                        <Link to="/">
                            <img src={logo} alt="Netflix Case Study" className="w-[200px] h-[100px]" />
                        </Link>
                    </div>
                    <div className="flex">
                        <ul className="flex">
                            <li className="p-4 hover:text-red-500"><Link to="/">Trang chủ</Link></li>
                            <li className="p-4 hover:text-red-500"><Link to="/phim-bo">Phim Bộ</Link></li>
                            <li className="p-4 hover:text-red-500"><Link to="/phim-le">Phim lẻ</Link></li>
                            <li className="p-4 hover:text-red-500"><Link to="/my-list">Danh sách của tôi</Link></li>
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit} className="flex items-center ">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="border border-red-500 p-2 bg-black text-white placeholder-gray-500 rounded-[35px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <button type="submit">
                            <CiSearch color="red" className="font-bold text-red-500 ml-2 cursor-pointer" />
                        </button>
                    </form> 
                </div>
            </div>
        </div>
    );
}

export default Header;

import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#101010] mt-10 w-full text-white  py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 container mx-auto px-4">
                <div className="mr-4">
                    <h2 className="py-4 font-bold text-4xl text-red-500">Giới Thiệu</h2>
                    <p>Website xem phim miễn phí, chất lượng cao, không quảng cáo.</p> 
                </div>
                <div>
                    <div>
                        <h2 className="py-4 font-bold text-4xl text-red-500">Danh Mục</h2>
                    </div>
                    <ul>
                    <li className="py-2">
                        <Link to="/" className="hover:text-red-500">Trang Chủ</Link>
                    </li>
                    <li className="py-2">
                        <Link to="/phim-bo" className="hover:text-red-500">Phim Bộ</Link>
                    </li>
                    <li className="py-2">
                        <Link to="/phim-le" className="hover:text-red-500">Phim Lẻ</Link>
                    </li>
                    <li className="py-2 ">
                        <Link to="/my-list" className="hover:text-red-500">Danh Sách Của Tôi</Link>
                    </li>
                    </ul>
                </div>
                <div>
                    <h2 className="py-4 font-bold text-4xl text-red-500">INFO BẠN ĐẸP TRAI</h2>
                    <ul className="flex space-x-4 ">
                        <li className="text-3xl">
                            <a href="https://www.facebook.com/nguyen.thanh.du.601641/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                                <FaFacebook />
                            </a>
                        </li>
                        <li > 
                            <a href="https://www.instagram.com/thanhdu1402/" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-red-500">
                                <FaInstagram />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

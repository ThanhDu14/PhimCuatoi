import React from 'react';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0f0f0f] border-t border-white/5 py-12 text-netflix-textGray text-xs md:text-sm font-sans mt-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">

                {/* Intro column */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase border-b border-netflix-red pb-1.5 inline-block">
                        PHIM<span className="text-netflix-red">CUATOI</span>
                    </h4>
                    <p className="leading-relaxed font-light text-netflix-textGray">
                        Website xem phim trực tuyến miễn phí, chất lượng cao, không chèn quảng cáo khó chịu. Trải nghiệm điện ảnh tốt nhất dành cho bạn!
                    </p>
                </div>

                {/* Directory Column */}
                <div className="space-y-3">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider">Danh Mục</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="text-netflix-textGray hover:text-netflix-red hover:underline transition-colors duration-150">
                                Trang Chủ
                            </Link>
                        </li>
                        <li>
                            <Link to="/phim-bo" className="text-netflix-textGray hover:text-netflix-red hover:underline transition-colors duration-150">
                                Phim Bộ
                            </Link>
                        </li>
                        <li>
                            <Link to="/phim-le" className="text-netflix-textGray hover:text-netflix-red hover:underline transition-colors duration-150">
                                Phim Lẻ
                            </Link>
                        </li>
                        <li>
                            <Link to="/my-list" className="text-netflix-textGray hover:text-netflix-red hover:underline transition-colors duration-150">
                                Danh Sách Của Tôi
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div className="space-y-3">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider">Hỗ Trợ</h4>
                    <ul className="space-y-2">
                        <li className="hover:text-white transition-colors duration-150 cursor-pointer">
                            Câu hỏi thường gặp
                        </li>
                        <li className="hover:text-white transition-colors duration-150 cursor-pointer">
                            Trung tâm hỗ trợ
                        </li>
                        <li className="hover:text-white transition-colors duration-150 cursor-pointer">
                            Điều khoản sử dụng
                        </li>
                        <li className="hover:text-white transition-colors duration-150 cursor-pointer">
                            Quyền riêng tư
                        </li>
                    </ul>
                </div>

            </div>
            <div className="border-t border-white/5 mt-10 pt-6 text-center max-w-6xl mx-auto px-4 text-netflix-textGray/60 text-xs space-y-2">
                <p>&copy; {new Date().getFullYear()} Phim Của Tôi. All rights reserved. Designed for cinema fans.</p>
                <p className="text-netflix-textGray/40 max-w-3xl mx-auto leading-relaxed text-[10px] md:text-xs">
                    * Tuyên bố miễn trừ trách nhiệm: Đây là dự án phi thương mại phục vụ mục đích học tập và nghiên cứu công nghệ (Portfolio cá nhân). Mọi nội dung thông tin, hình ảnh và video trên trang web đều được nhúng từ các nguồn mở công khai trực tuyến bên ngoài. Chúng tôi không trực tiếp lưu trữ, tải lên hoặc chịu bất kỳ trách nhiệm pháp lý nào đối với nội dung và bản quyền của các tệp tin này.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

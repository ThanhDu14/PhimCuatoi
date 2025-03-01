import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#101010] mt-10 w-full text-white mt-[200px] py-4">
            <div className="container mx-auto flex flex-wrap justify-between px-6">
                <div className="mr-4">
                    <h2 className="py-4 font-bold text-4xl text-red-500">Giới Thiệu</h2>
                    <p>Website xem phim miễn phí, chất lượng cao, không quảng cáo.</p> 
                </div>
                <div>
                    <h2 className="py-4 font-bold text-4xl text-red-500">About Us</h2>
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

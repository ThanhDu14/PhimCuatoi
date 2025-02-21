import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FilmInfo = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await fetch(`https://phimapi.com/phim/${slug}`);
                const result = await response.json();
                
                if (result) {
                    setData(result);
                } else {
                    setError("Không tìm thấy phim.");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu phim.");
                console.error("Lỗi khi lấy dữ liệu phim:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, [slug]);

    if (loading) {
        return <div className="text-center mt-20 text-lg">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-20">{error}</div>;
    }

    if (!data) {
        return <div className="text-center mt-20">Không có dữ liệu phim.</div>;
    }

    const { name, thumb_url, episodes } = data;
    const linkEmbed = episodes?.[0]?.server_data?.[0]?.link_embed || "#";

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">{name}</h2>
            <img src={thumb_url} alt={name} className="w-[300px] h-auto rounded-lg shadow-lg mb-4" />
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                <a href={linkEmbed} target="_self" rel="noopener noreferrer">
                    Xem phim
                </a>
            </button>
        </div>
    );
};

export default FilmInfo;

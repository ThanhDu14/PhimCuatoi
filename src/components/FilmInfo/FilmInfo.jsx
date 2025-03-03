import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Skeleton = () => (
    <div className="grid grid-cols-5 gap-4 p-4 animate-pulse">
        <div className="col-span-2">
            <div className="bg-gray-300 h-96 w-full rounded-lg mb-4"></div>
        </div>
        <div className="col-span-3 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

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
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, [slug]);

    if (loading) {
        return <Skeleton />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-20">{error}</div>;
    }

    if (!data) {
        return <div className="text-center mt-20">Không có dữ liệu phim.</div>;
    }

    const { name, poster_url, content, lang, year } = data.movie;
    const episodeList = data.episodes?.[0]?.server_data || [];

    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                    <img
                        src={poster_url}
                        alt={name}
                        className="w-full h-auto rounded-lg shadow-lg mb-4 transition-transform duration-500 hover:scale-110"
                    />
                </div>
                <div className="col-span-3 space-y-4">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-2">{name}</h2>
                    <p className="text-gray-700 border-b border-gray-300 pb-2"><b>Nội dung phim:</b> {content}</p>
                    <p className="text-gray-700 border-b border-gray-300 pb-2"><b>Ngôn ngữ:</b> {lang}</p>
                    <div className="text-gray-700 border-b border-gray-300 pb-2"><b>Năm Phát Hành:</b> {year}</div>
                </div>
            </div>
            {episodeList.length > 1 ? (
                <div className="grid grid-cols-6 gap-2 items-start">
                    <div className="col-span-6 text-xl font-bold mb-2">Danh sách tập phim:</div>
                    {episodeList.map((ep, index) => (
                        <a
                            key={index}
                            href={ep.link_embed}
                            target="_self"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-center"
                        >
                            Tập {index + 1}
                        </a>
                    ))}
                </div>
            ) : (
                <a
                    href={episodeList[0]?.link_embed || "#"}
                    target="_self"
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-center"
                >
                    Xem phim
                </a>
            )}
        </div>
    );
};

export default FilmInfo;
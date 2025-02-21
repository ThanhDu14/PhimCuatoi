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
                    console.log(result);
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

    const { name, poster_url, content,lang,year } = data.movie;
    const { episodes, categories } = data; 
 
    const episodeList = episodes?.[0]?.server_data || []; 


    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col">
                <div className="flex items-start gap-4">
                    <img src={poster_url} alt={name} className="w-[300px] h-auto  rounded-lg shadow-lg mb-4" />

                   
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2 border-b border-gray-300 mb-4">{name}</h2>
                        <p className="text-gray-700 border-b border-gray-300 mb-4"><b>Nội dung phim:</b> {content}</p>
                        <p className="text-gray-700 border-b border-gray-300 mb-4"><b>Ngôn ngữ:</b>{lang}</p>
                        <div className="text-gray-700 border-b border-gray-300 "><b>Năm Phát Hành:</b>{year}</div>
                    </div>
                </div>
            </div>

            {episodeList.length > 1 ? (

                <div className="flex flex-wrap gap-2 ">
                    Danh Sách Tập Phim<br></br>
                    {episodeList.map((ep, index) => (
                        <a
                            key={index}
                            href={ep.link_embed}
                            target="_self"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
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
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Xem phim
                </a>
            )}
        </div>
    );
};

export default FilmInfo;

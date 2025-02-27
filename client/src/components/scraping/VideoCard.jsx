import React from "react";

const VideoCard = ({ video }) => {
    return (
        <div className="p-4 shadow-lg rounded-lg bg-white">
            <h3 className="font-bold text-lg">{video.title}</h3>
            <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            <p className="text-gray-600">{video.description}</p>
        </div>
    );
};

export default VideoCard;

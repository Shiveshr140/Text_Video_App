import React from 'react';
import './VideoCard.css';

const VideoCard = React.memo(({ type, title, description, gradient, icon: Icon, onClick, isActive }) => {
    return (
        <div
            className={`video-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="card-gradient" style={{ background: gradient }}></div>
            <div className="card-content">
                <div className="icon-wrapper">
                    <Icon size={32} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="card-shine"></div>
        </div>
    );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;

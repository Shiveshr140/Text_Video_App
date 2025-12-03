import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, status, error }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'generated-video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence mode="wait">
            {(status === 'completed' || status === 'failed') && (
                <motion.div
                    className="video-player-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                >
                    {status === 'completed' && videoUrl && (
                        <div className="video-container glass-panel">
                            <div className="success-badge">
                                <CheckCircle size={20} />
                                <span>Video Ready!</span>
                            </div>

                            <video controls className="video-element">
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            <motion.button
                                className="download-btn"
                                onClick={handleDownload}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Download size={20} />
                                Download Video
                            </motion.button>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="error-container glass-panel">
                            <XCircle size={48} className="error-icon" />
                            <h3>Generation Failed</h3>
                            <p>{error || 'An error occurred while generating the video.'}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VideoPlayer;

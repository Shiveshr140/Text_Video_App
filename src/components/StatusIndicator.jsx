import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Clock } from 'lucide-react';
import './StatusIndicator.css';

const StatusIndicator = ({ status, isGenerating }) => {
    return (
        <AnimatePresence>
            {isGenerating && status === 'processing' && (
                <motion.div
                    className="status-indicator glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="status-content">
                        <Loader className="status-spinner" size={24} />
                        <div className="status-text">
                            <h4>Generating Your Video</h4>
                            <p>This may take 2-5 minutes. Please wait...</p>
                        </div>
                    </div>

                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 180, ease: 'linear' }}
                        />
                    </div>

                    <div className="status-tip">
                        <Clock size={16} />
                        <span>Tip: Longer content takes more time to process</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatusIndicator;

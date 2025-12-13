import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText, Sparkles } from 'lucide-react';
import VideoCard from './components/VideoCard';
import InputSection from './components/InputSection';
import StatusIndicator from './components/StatusIndicator';
import VideoPlayer from './components/VideoPlayer';
import './App.css';


const API_BASE = "https://until-excuse-upcoming-maiden.trycloudflare.com"
const videoTypes = [
  {
    id: 'text',
    title: 'Text to Video',
    description: 'Transform educational text into engaging animated videos',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    icon: FileText,
    endpoint: '/generate/text'
  },
  {
    id: 'code',
    title: 'Code to Video',
    description: 'Create code explanation videos with syntax highlighting',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    icon: Code,
    endpoint: '/generate/code'
  },
  {
    id: 'query',
    title: 'AI Animation Video',
    description: 'Generate AI-powered animated videos from any question',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
    icon: Sparkles,
    endpoint: '/generate/query'
  }
];

function App() {
  const [selectedType, setSelectedType] = useState(null);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Poll job status
  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') {
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/status/${jobId}`);
        const data = await response.json();

        setStatus(data.status);

        if (data.status === 'completed') {
          setVideoUrl(`${API_BASE}${data.video_url}`);
          setIsGenerating(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        } else if (data.status === 'failed') {
          setError(data.error || 'Video generation failed');
          setIsGenerating(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError('Failed to check video status');
        setIsGenerating(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    };

    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(pollStatus, 5000);
    pollStatus(); // Initial poll

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [jobId, status]);

  const handleGenerate = useCallback(async () => {
    if (!selectedType || !content.trim()) return;

    setIsGenerating(true);
    setStatus('processing');
    setVideoUrl(null);
    setError(null);

    const selectedVideo = videoTypes.find(v => v.id === selectedType);

    // Build payload based on video type
    let payload = {
      content: content,
      language: 'english'
    };

    // Add renderer for text and code videos
    if (selectedType === 'text') {
      payload.renderer = 'remotion';
    } else if (selectedType === 'code') {
      payload.renderer = 'remotion';
      payload.code_language = 'python';
    }
    // For 'query' type, keep it simple with just content and language

    try {
      const response = await fetch(`${API_BASE}${selectedVideo.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }

      const data = await response.json();
      setJobId(data.job_id);
    } catch (err) {
      console.error('Error generating video:', err);
      setError('Failed to start video generation. Please try again.');
      setIsGenerating(false);
      setStatus('failed');
    }
  }, [selectedType, content]);

  const handleCardClick = useCallback((typeId) => {
    setSelectedType(typeId);
    setContent('');
    setVideoUrl(null);
    setError(null);
    setStatus('idle');
    setJobId(null);
  }, []);

  return (
    <div className="app">
      <div className="background-gradient"></div>

      <div className="container">
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="gradient-text">AI Video Generator</h1>
          <p className="subtitle">Transform your ideas into stunning videos with AI</p>
        </motion.header>

        <div className="cards-grid">
          {videoTypes.map((type) => (
            <VideoCard
              key={type.id}
              {...type}
              isActive={selectedType === type.id}
              onClick={() => handleCardClick(type.id)}
            />
          ))}
        </div>

        <InputSection
          selectedType={selectedType}
          content={content}
          setContent={setContent}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <StatusIndicator
          status={status}
          isGenerating={isGenerating}
        />

        <VideoPlayer
          videoUrl={videoUrl}
          status={status}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;

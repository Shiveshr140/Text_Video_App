import React from 'react';
import { Send, Loader } from 'lucide-react';
import './InputSection.css';

const placeholders = {
    text: "Enter your educational text here... (e.g., 'Photosynthesis is how plants make food using sunlight')",
    code: "Paste your code here... (e.g., 'def bubble_sort(arr):\\n    ...')",
    query: "Ask a question or topic... (e.g., 'Explain how binary search works')"
};

const InputSection = React.memo(({ selectedType, content, setContent, onGenerate, isGenerating }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && !isGenerating) {
            onGenerate();
        }
    };

    if (!selectedType) return null;

    return (
        <div className="input-section">
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper glass-panel">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholders[selectedType]}
                        rows={6}
                        disabled={isGenerating}
                    />
                </div>

                <button
                    type="submit"
                    className="generate-btn"
                    disabled={!content.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader className="spinner" size={20} />
                            Generating Video...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Generate Video
                        </>
                    )}
                </button>
            </form>
        </div>
    );
});

InputSection.displayName = 'InputSection';

export default InputSection;

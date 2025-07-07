import React from 'react';

interface ImageAnalysisProps {
    analysis: string;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ analysis }) => {
    return (
        <div className="bg-white rounded-lg shadow-md mt-4 p-6">
            <h2 className="text-xl font-semibold mb-4">
                Image Analysis Results
            </h2>
            <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                    {analysis}
                </p>
            </div>
        </div>
    );
};

export default ImageAnalysis; 
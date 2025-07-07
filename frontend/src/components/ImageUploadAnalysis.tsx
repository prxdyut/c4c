import React, { useState } from 'react';
import ImageAnalysis from './ImageAnalysis';
import axios from 'axios';

interface AnalysisResponse {
    message: string;
    data: {
        analysis: string;
        animal: any;
    };
}

const ImageUploadAnalysis: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse['data']['analysis'] | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, or WebP)');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post<AnalysisResponse>(
                '/api/animals/analyze-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setAnalysisResult(response.data.data.analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        Animal Image Analysis
                    </h1>

                    {/* Upload Section */}
                    <div className="flex flex-col items-center gap-4">
                        <label className="relative cursor-pointer">
                            <span className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    'Select Image'
                                )}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                disabled={loading}
                            />
                        </label>

                        {error && (
                            <div className="w-full bg-red-50 text-red-500 p-4 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="mt-4 w-full max-h-96 overflow-hidden rounded-lg">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className={`mt-4 px-6 py-2 rounded-md transition-colors ${
                                !selectedFile || loading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Image'}
                        </button>
                    </div>

                    {/* Analysis Results */}
                    {analysisResult && <ImageAnalysis analysis={analysisResult.toString()} />}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadAnalysis; 
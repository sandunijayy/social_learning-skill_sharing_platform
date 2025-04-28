import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadFile, VideoLibrary, Image, Close } from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Clean up object URLs to avoid memory leaks
        return () => previews.forEach(URL.revokeObjectURL);
    }, [previews]);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (isVideo) {
            if (files.length > 1) return alert('Only 1 video allowed');
        } else {
            if (files.length > 3) return alert('Up to 3 images allowed');
        }
        setMediaFiles(files);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeMedia = (index) => {
        const newMediaFiles = [...mediaFiles];
        newMediaFiles.splice(index, 1);
        setMediaFiles(newMediaFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('description', description);
        formData.append('isVideo', isVideo);
        mediaFiles.forEach((file) => formData.append('mediaFiles', file));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                setDescription('');
                setMediaFiles([]);
                setPreviews([]);
                setIsVideo(false);
                onPostCreated?.();
            } else {
                const errText = await res.text();
                alert('Post failed: ' + errText);
            }
        } catch (err) {
            console.error('Error posting:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
            <h2 className="text-2xl font-bold mb-4">✨ Create a New Post</h2>
            <div className="border-b border-gray-200 mb-4"></div>

            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                    rows="4"
                    placeholder="What's on your mind?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="flex items-center my-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                            checked={isVideo}
                            onChange={(e) => {
                                setIsVideo(e.target.checked);
                                setMediaFiles([]);
                                setPreviews([]);
                            }}
                        />
                        <span className="ml-2 text-gray-700">Video Post</span>
                    </label>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 mb-4 text-gray-600"
                >
                    {isVideo ? <VideoLibrary /> : <Image />}
                    <span className="text-sm">
                        {isVideo ? 'Upload 1 video' : 'Upload up to 3 images'}
                    </span>
                </motion.div>

                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition duration-200 ease-in-out">
                    <UploadFile className="mr-2" />
                    <span>Choose {isVideo ? 'Video' : 'Images'}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept={isVideo ? 'video/*' : 'image/*'}
                        multiple={!isVideo}
                        onChange={handleMediaChange}
                    />
                </label>

                {previews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 grid grid-cols-3 gap-4"
                    >
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                {isVideo ? (
                                    <video
                                        src={preview}
                                        className="w-full h-32 object-cover rounded"
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200 ease-in-out"
                                >
                                    <Close fontSize="small" />
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}

                <div className="flex justify-end mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`px-4 py-2 bg-green-500 text-white rounded-md ${
                            isLoading || mediaFiles.length === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-green-600'
                        } transition duration-200 ease-in-out`}
                        disabled={isLoading || mediaFiles.length === 0}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <UploadFile className="mr-2" />
                                Post
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreatePost;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ThumbUpAltOutlined,
    ChatBubbleOutline,
    ShareOutlined,
} from '@mui/icons-material';
import {
    Container,
    Typography,
    Paper,
    Button,
    IconButton,
    Divider,
    TextField,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    Backdrop,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';



// Import the separated components
import Navbar from './Navbar';
import Sidebar from './Sidebar';


const Post = () => {
    const [posts, setPosts] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [sharePostId, setSharePostId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/posts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            // Sort posts by createdAt or id descending
            const sortedPosts = data.sort((a, b) => {
                // If you have a timestamp field like createdAt, use it
                if (a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                // Otherwise fallback to id (assuming higher id means newer post)
                return b.id - a.id;
            });

            setPosts(sortedPosts);
        } catch (err) {
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/auth/signout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Error signing out on server:', err);
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs({ ...commentInputs, [postId]: value });
    };

    const handleCommentSubmit = (postId) => {
        const comment = commentInputs[postId]?.trim();
        if (comment) {
            console.log(`Comment on post ${postId}:`, comment);
            setCommentInputs({ ...commentInputs, [postId]: '' });
        }
    };

    const handleSharePost = (postId) => {
        setSharePostId(postId);
        setShareDialogOpen(true);
    };

    const handleShareSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${sharePostId}/share`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Post shared successfully');
                setShareDialogOpen(false);
                fetchPosts();
            } else {
                const errorData = await response.json();
                console.error('Failed to share post:', errorData.message);
            }
        } catch (err) {
            console.error('Error sharing post:', err);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Animation variants for posts
    const postVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Include Sidebar component */}
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                navigate={navigate}
                handleLogout={handleLogout}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Include Navbar component */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Main content area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Container maxWidth="sm" className="py-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography variant="h5" gutterBottom className="text-2xl font-bold text-gray-800 mb-6">
                                📢 All Posts
                            </Typography>
                        </motion.div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <CircularProgress color="primary" />
                            </div>
                        ) : posts.length === 0 ? (
                            <Typography className="text-gray-600">No posts found.</Typography>
                        ) : (
                            posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={postVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <Paper elevation={3} className="p-6 mb-8 rounded-lg shadow-lg">
                                        <div className="flex items-center mb-4">
                                            <Avatar className="bg-indigo-500 mr-3">
                                                {post.username?.charAt(0) || 'U'}
                                            </Avatar>
                                            <Typography className="font-bold text-gray-800">{post.username || 'User'}</Typography>
                                        </div>

                                        <Typography className="mb-4 text-gray-700">
                                            {post.description} {post.originalPostId && (
                                                <motion.span
                                                    className="text-blue-500 ml-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    (Shared)
                                                </motion.span>
                                            )}
                                        </Typography>

                                        {post.mediaType === 'IMAGE' &&
                                            post.imageUrls?.map((url, idx) => (
                                                <motion.img
                                                    key={idx}
                                                    src={url}
                                                    alt={`Post ${idx}`}
                                                    className="w-full rounded-lg mb-4 shadow-md"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                />
                                            ))}

                                        {post.mediaType === 'VIDEO' && post.videoUrl && (
                                            <motion.video
                                                controls
                                                className="w-full rounded-lg mb-4 shadow-md"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <source src={post.videoUrl} type="video/mp4" />
                                            </motion.video>
                                        )}

                                        <div className="flex justify-around mt-4 mb-4">
                                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                <IconButton color="primary">
                                                    <ThumbUpAltOutlined />
                                                </IconButton>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                <IconButton color="primary">
                                                    <ChatBubbleOutline />
                                                </IconButton>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleSharePost(post.id)}
                                                >
                                                    <ShareOutlined />
                                                </IconButton>
                                            </motion.div>
                                        </div>

                                        <Divider className="my-4" />

                                        <div className="flex gap-4 items-center">
                                            <Avatar className="bg-gray-400">U</Avatar>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Write a comment..."
                                                value={commentInputs[post.id] || ''}
                                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCommentSubmit(post.id);
                                                    }
                                                }}
                                                className="bg-white rounded-full shadow-inner"
                                            />
                                        </div>
                                    </Paper>
                                </motion.div>
                            ))
                        )}
                    </Container>
                </main>
            </div>

            <Dialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle>Share Post</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to share this post?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleShareSubmit}
                        color="primary"
                        variant="contained"
                        style={{ borderRadius: '20px' }}
                    >
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Post;
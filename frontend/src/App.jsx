import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Post from "./components/Post.jsx";
import MyPosts from "./components/MyPosts.jsx";
import SharedPosts from "./components/SharedPosts.jsx";
import MyProfile from "./components/MyProfile.jsx";

const App = () => {
    return (
        <GoogleOAuthProvider clientId="507608362836-3qe3nq4n5900e3559f1v6udf4mk47g2q.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Post />} />
                    <Route path="/shared" element={<SharedPosts />} />
                    <Route path="/dashboard" element={<Post />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/mypost" element={<MyPosts />} />
                    <Route path="/my-profile" element={<MyProfile/>} />
                    <Route path="/" element={<Login  />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
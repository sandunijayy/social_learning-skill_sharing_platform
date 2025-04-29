import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    Fade,
    Zoom,
    CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/auth/signin", {
                username,
                password,
            });
            const { token } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                // Delay navigation slightly to show success state
                setTimeout(() => {
                    navigate("/post");
                }, 800);
            }
        } catch (err) {
            setError("Login failed, please try again.");
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth="sm">
            <Fade in={true} timeout={1000}>
                <Paper
                    elevation={6}
                    sx={{
                        mt: 10,
                        p: 4,
                        borderRadius: 3,
                        background: "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
                        }
                    }}
                    component={motion.div}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Zoom in={true} timeout={800} style={{ transitionDelay: '300ms' }}>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.light',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Person fontSize="large" sx={{ color: '#fff' }} />
                            </Box>
                        </Zoom>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                mb: 3,
                                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}
                        >
                            Welcome Back
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                        borderColor: "primary.main",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderWidth: "1px",
                                    },
                                    borderRadius: 2,
                                },
                                transition: "transform 0.2s ease-in-out",
                                "&:focus-within": {
                                    transform: "scale(1.01)",
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                        borderColor: "primary.main",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderWidth: "1px",
                                    },
                                    borderRadius: 2,
                                },
                                transition: "transform 0.2s ease-in-out",
                                "&:focus-within": {
                                    transform: "scale(1.01)",
                                },
                            }}
                        />

                        <Fade in={!!error} timeout={600}>
                            <Box sx={{ width: '100%', mt: 2 }}>
                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                            </Box>
                        </Fade>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .3)",
                                },
                                "&:active": {
                                    transform: "translateY(0)",
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                    "&:hover": {
                                        color: "primary.main",
                                    },
                                }}
                            >
                                Forgot password?
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1 }}
                            >
                                Don't have an account?{" "}
                                <Typography
                                    component="span"
                                    color="primary"
                                    sx={{
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        transition: "color 0.2s",
                                        "&:hover": {
                                            color: "primary.dark",
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    Sign up now
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default Login;
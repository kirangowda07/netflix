import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        const result = await register({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <GlassCard className="w-full max-w-md relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-white">Sign Up</h2>
                {error && <div className="bg-red-600/50 border border-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        name="username"
                        label="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="phone"
                        type="tel"
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Input
                        name="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" className="mt-4">Sign Up</Button>
                </form>
                <div className="mt-4 text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>.
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;

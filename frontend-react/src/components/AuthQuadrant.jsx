import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Building } from 'lucide-react';
import apiService from '../services/api';
import styles from './AuthQuadrant.module.css';

const AuthQuadrant = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        orgname: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggle = (val) => {
        setIsLogin(val);
        setMessage({ text: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        const trimmedData = {
            orgname: formData.orgname.trim(),
            email: formData.email.trim(),
            password: formData.password.trim()
        };

        try {
            if (isLogin) {
                const result = await apiService.login(trimmedData.orgname, trimmedData.email, trimmedData.password);
                if (result.message.includes('✅')) {
                    setMessage({ text: result.message, type: 'success' });
                    localStorage.setItem('orgname', result.name);
                    localStorage.setItem('email', trimmedData.email);
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    setMessage({ text: result.message, type: 'error' });
                }
            } else {
                const result = await apiService.createAccount(trimmedData.orgname, trimmedData.email, trimmedData.password);
                if (result.message.includes('✅')) {
                    setMessage({ text: result.message, type: 'success' });
                    setTimeout(() => handleToggle(true), 2000);
                } else {
                    setMessage({ text: result.message, type: 'error' });
                }
            }
        } catch (error) {
            setMessage({
                text: `❌ Error: ${error.message || 'Connection failed'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authQuadrant}>
            <div className={styles.toggleContainer}>
                <div
                    className={styles.slider}
                    style={{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }}
                />
                <button
                    className={`${styles.toggleBtn} ${isLogin ? styles.toggleBtnActive : ''}`}
                    onClick={() => handleToggle(true)}
                >
                    Login
                </button>
                <button
                    className={`${styles.toggleBtn} ${!isLogin ? styles.toggleBtnActive : ''}`}
                    onClick={() => handleToggle(false)}
                >
                    Register
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={isLogin ? 'login' : 'register'}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className={styles.formTitle}>
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className={styles.formSub}>
                        {isLogin
                            ? 'Login to manage your enterprise data.'
                            : 'Create an account for your organization.'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <Building className={styles.inputIcon} size={20} />
                                <input
                                    type="text"
                                    name="orgname"
                                    placeholder="Organization name"
                                    className={styles.input}
                                    value={formData.orgname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className={styles.input}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (isLogin ? 'Authenticating...' : 'Creating Account...')
                                : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </motion.div>
            </AnimatePresence>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.message} ${styles[message.type]}`}
                >
                    {message.text}
                </motion.div>
            )}
        </div>
    );
};

export default AuthQuadrant;

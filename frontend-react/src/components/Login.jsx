import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import styles from './Login.module.css';
import logo from '../assets/logo.png';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        orgname: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const result = await apiService.login(formData.orgname, formData.email, formData.password);

            if (result.message.includes('✅')) {
                setMessage({ text: result.message, type: 'success' });
                localStorage.setItem('orgname', result.name);
                localStorage.setItem('email', formData.email);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            console.error('Login Error:', error);
            setMessage({
                text: `❌ Connection error. ${error.message || JSON.stringify(error) || 'Please try again.'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={logo} alt="LOGIXA" className={styles.logo} style={{ height: '60px', marginBottom: '20px' }} />
                <h1>AI DB Insights</h1>
                <p>Admin Portal</p>
            </header>

            <div className={styles.card}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="orgname">Organization Name</label>
                        <input
                            type="text"
                            id="orgname"
                            name="orgname"
                            value={formData.orgname}
                            onChange={handleChange}
                            placeholder="Enter your organization"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@organization.com"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className={styles.formFooter}>
                        <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Create Account</a></p>
                    </div>
                </form>
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;

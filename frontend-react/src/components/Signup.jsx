import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import styles from './Signup.module.css';
import logo from '../assets/logo.png';

function Signup() {
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
            const result = await apiService.createAccount(formData.orgname, formData.email, formData.password);

            if (result.message.includes('✅')) {
                setMessage({ text: result.message, type: 'success' });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: '❌ Connection error. Please try again.', type: 'error' });
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
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="orgname">Organization Name</label>
                        <input
                            type="text"
                            id="orgname"
                            name="orgname"
                            value={formData.orgname}
                            onChange={handleChange}
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
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <div className={styles.formFooter}>
                        <p>Already have an account? <a href="#" onClick={() => navigate('/')}>Login</a></p>
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

export default Signup;

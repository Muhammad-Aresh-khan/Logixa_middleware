import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LogOut, UserPlus, Shield, Database } from 'lucide-react';
import apiService from '../services/api';
import LicenseCard from './LicenseCard';
import styles from './Dashboard.module.css';
import logo from '../assets/logo.png';

function Dashboard() {
    const navigate = useNavigate();
    const [orgname, setOrgname] = useState('');
    const [licenses, setLicenses] = useState([]);
    const [formData, setFormData] = useState({
        license_key: '',
        email: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedOrgname = localStorage.getItem('orgname');
        if (!storedOrgname) {
            navigate('/');
        } else {
            setOrgname(storedOrgname);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('orgname');
        localStorage.removeItem('email');
        navigate('/');
    };

    const loadLicenses = async () => {
        setIsLoadingLicenses(true);
        setMessage({ text: '', type: '' });
        try {
            const result = await apiService.getLicenseDetails(orgname);

            if (result.result && Array.isArray(result.result)) {
                setLicenses(result.result);
                setMessage({ text: '✅ Licenses loaded successfully', type: 'success' });
            } else {
                setLicenses([]);
                setMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: '❌ Error loading licenses', type: 'error' });
        } finally {
            setIsLoadingLicenses(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            // Correct order of arguments to match apiService.mapUser(license_key, orgname, email)
            const result = await apiService.mapUser(formData.license_key, orgname, formData.email);

            if (result.message.includes('✅')) {
                setMessage({ text: result.message, type: 'success' });
                setFormData({ license_key: '', email: '' });
                setTimeout(() => {
                    loadLicenses();
                }, 1000);
            } else {
                setMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: '❌ Connection error. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, background: 'rgba(26, 29, 33, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '90%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="LOGIXA" style={{ height: '40px', width: 'auto' }} />
                    </div>
                    <button onClick={handleLogout} className={styles.btnSecondary} style={{ marginBottom: 0 }}>
                        <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
                    </button>
                </div>
            </nav>

            <div className={styles.dashboardHeader}>
                <div>
                    <h2>Welcome, <span style={{ color: 'var(--primary)' }}>{orgname}</span></h2>
                    <p className={styles.subtitle}>License Management Dashboard</p>
                </div>
                <button onClick={loadLicenses} className={styles.btnSecondary} style={{ marginBottom: 0 }} disabled={isLoadingLicenses}>
                    <RefreshCw size={16} style={{ marginRight: '8px', animation: isLoadingLicenses ? 'spin 1s linear infinite' : 'none' }} />
                    {isLoadingLicenses ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Shield style={{ color: 'var(--primary)' }} />
                    <h3 style={{ margin: 0 }}>Your Licenses</h3>
                </div>
                <div className={styles.licensesGrid}>
                    {licenses.length > 0 ? (
                        licenses.map((license, index) => (
                            <LicenseCard key={index} license={license} />
                        ))
                    ) : (
                        <div className={styles.textMuted}>
                            <Database size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>No licenses found. Click "Refresh" to load your data.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <UserPlus style={{ color: 'var(--primary)' }} />
                    <h3 style={{ margin: 0 }}>Map User to License</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="license_key">Select License</label>
                        <select
                            id="license_key"
                            name="license_key"
                            value={formData.license_key}
                            onChange={handleChange}
                            required
                            className={styles.selectInput}
                        >
                            <option value="">-- Select a License --</option>
                            {licenses.map((license, index) => (
                                <option key={index} value={license.license_key} disabled={license.used}>
                                    {license.package_name} - {license.license_key} {license.used ? '(Used)' : `(${license.status})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="user-email">User Email</label>
                        <input
                            type="email"
                            id="user-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                        />
                    </div>
                    <button type="submit" className={styles.btnPrimary} disabled={isSubmitting || licenses.filter(l => !l.used).length === 0}>
                        {isSubmitting ? 'Mapping...' : 'Map User'}
                    </button>
                </form>
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;

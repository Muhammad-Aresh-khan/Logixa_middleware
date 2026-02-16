import { motion } from 'framer-motion';
import AuthQuadrant from './AuthQuadrant';
import styles from './LandingPage.module.css';
import logo from '../assets/logo.png';
import loginBg from '../assets/login_bg.jpg';

const LandingPage = () => {
    return (
        <div className={styles.landing}>
            <div className={styles.splitScreen}>
                {/* Left Side: Logo */}
                <motion.div
                    className={styles.leftSide}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <img src={loginBg} alt="Login Background" className={styles.backgroundImage} />
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="LOGIXA" className={styles.productLogo} />
                    </div>
                </motion.div>

                {/* Right Side: Auth Form */}
                <motion.div
                    className={styles.rightSide}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className={styles.formWrapper}>
                        <AuthQuadrant />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;


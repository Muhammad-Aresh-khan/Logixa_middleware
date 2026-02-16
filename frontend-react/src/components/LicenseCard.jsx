import styles from './LicenseCard.module.css';

function LicenseCard({ license }) {
    return (
        <div className={styles.licenseCard}>
            <h4>{license.package_name}</h4>
            <div className={styles.licenseInfo}>
                <div className={styles.licenseInfoRow}>
                    <span className={styles.label}>License Key:</span>
                    <span className={styles.value}>{license.license_key}</span>
                </div>
                <div className={styles.licenseInfoRow}>
                    <span className={styles.label}>Issue Date:</span>
                    <span className={styles.value}>{license.issue_date}</span>
                </div>
                <div className={styles.licenseInfoRow}>
                    <span className={styles.label}>Expiry Date:</span>
                    <span className={styles.value}>{license.expiry_date}</span>
                </div>
                <div className={styles.licenseInfoRow}>
                    <span className={styles.label}>Status:</span>
                    <span className={`${styles.statusBadge} ${styles[`status${license.status}`]}`}>
                        {license.status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LicenseCard;

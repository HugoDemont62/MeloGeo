import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
            <p>&copy; Fait avec 💚 par Agathe, Baptiste, Philippe, Tom et Mathilde</p>
            </div>
            <div className={styles.content}>
            <p>&copy;  2024. Touts droits réservé</p>
            </div>
        </footer>
    );
};

export default Footer;

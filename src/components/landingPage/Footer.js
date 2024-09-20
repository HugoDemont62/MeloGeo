import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
            <p>&copy; Fait par Philippe Plaïa, Tom Engélibert et Hugo Dumont</p>
            <p>Basé sur un design réalisé par Agathe Moreau, Mathilde Fenart et Baptiste Blicq</p>
            </div>
            <div className={styles.content}>
            <p>&copy;  2024. Touts droits réservé</p>
            </div>
        </footer>
    );
};

export default Footer;

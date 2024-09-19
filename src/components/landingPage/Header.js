import Link from 'next/link';
import styles from './Header.module.css';
import Logo from './Logo';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src="/images/landingPage/logoMeloGéo.png" alt="Logo" className={styles.image} />
            </div>
            <nav className={styles.nav}>
                <Link href="/map" className={styles.links}>Démarrer une simulation</Link>
            </nav>
        </header>
    );
}

export default Header;

import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src="/images/landingPage/logoMeloGéo.png" alt="Logo" className={styles.image} />
            </div>
            <nav className={styles.nav}>
                <Link href="/map" className={styles.links}>Commencer une exploration</Link>
            </nav>
        </header>
    );
}

export default Header;
import Link from 'next/link';
import styles from './Header.module.css';
import Logo from './Logo';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Logo src="/images/Logoindex.png" alt="Logo" width={90} height={50} />
            </div>
            <nav className={styles.nav}>
                <Link href="/" className={styles.link}>Sensibiliser</Link>
                <Link href="/estimer" className={styles.link}>Estimer</Link>
                <Link href="/anticiper" className={styles.link}>Anticiper</Link>
                <Link href="/map" className={styles.link}>Démarrer une simulation</Link>
            </nav>
        </header>
    );
}

export default Header;

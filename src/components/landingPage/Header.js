import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
              <div className={styles.title}>Melody Quest</div>
            </div>
            <nav className={styles.nav}>
                <Link href="/map" className={styles.links}>Démarrer une simulation</Link>
            </nav>
        </header>
    );
}

export default Header;

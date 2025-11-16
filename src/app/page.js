import Link from 'next/link';
import styles from './home.module.css'; 

export default function SithRooHome() {
  return (
    <>
      {/* Background Flow Animation (from home.module.css) */}
      <div className={styles.background}></div>

      {/* Main Content Container (Glassy Buttons) */}
      <main className={styles.container}>
        <h1 className={styles.title}>Welcome to SithRoo.Store</h1>
        
        {/* SithRoo Library Button */}
        <Link href="/sithroo-library" className={styles.button}>
          SithRoo library
        </Link>
        
        {/* Kitto Button */}
        <Link href="/kitto-home" className={styles.button}>
          Kitto
        </Link>

        {/* ========================================= */}
        {/* === Footer Links Section === */}
        {/* ========================================= */}
        <footer className={styles.homeFooter}>
          <Link href="/about" className={styles.footerLink}>
            About Us
          </Link>
          <Link href="/contact" className={styles.footerLink}>
            Contact Us
          </Link>
          <Link href="/faq" className={styles.footerLink}>
            FAQ
          </Link>
          <Link href="/privacy-policy" className={styles.footerLink}>
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className={styles.footerLink}>
            Terms of Service
          </Link>
        </footer>
        
      </main>
    </>
  );
}
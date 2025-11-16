import Link from 'next/link';

// === අපි දැන් හදපු CSS file එක import කරනවා ===
import styles from './home.module.css'; 

export default function SithRooHome() {
  return (
    <>
      {/* Background එකේ Flow Animation එක දාන div එක */}
      <div className={styles.background}></div>

      {/* Main Content Container එක */}
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
      </main>
    </>
  );
}
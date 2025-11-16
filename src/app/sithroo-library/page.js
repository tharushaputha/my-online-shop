import Link from 'next/link';

// Styles ටික
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a', // Dark background
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#e0f2f7', // Light blue text
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#aaa',
    marginBottom: '40px',
  },
  homeLink: {
    fontSize: '1rem',
    color: '#98d8d8', // Mint green link
    textDecoration: 'none',
    border: '1px solid #98d8d8',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  // homeLinkHover: { // Next.js වල inline style hover දාන්න බෑ, CSS file ඕනේ
  //   backgroundColor: '#98d8d8',
  //   color: '#1a1a1a',
  // }
};

export default function LibraryComingSoon() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Coming Soon...</h1>
      <p style={styles.subtitle}>SithRoo Library is under construction.</p>
      
      <Link href="/" style={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
}
import Link from 'next/link';

// CSS Styles ටික. ඔයාට ඕන විදිහට පාට, size වෙනස් කරගන්න
// මේක Next.js වල style දාන එක විදිහක්
const styles = {
  body: {
    backgroundColor: '#1a1a1a', // Dark background
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // මුළු screen එකම cover වෙන්න
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    fontSize: '2.5rem', // Title එකේ size එක
    color: 'white',
    marginBottom: '40px',
    textAlign: 'center',
  },
  button: {
    display: 'block',
    width: '80%',
    maxWidth: '400px', // Button එකේ උපරිම පළල
    fontSize: '1.5rem', // අකුරු වල size එක
    color: 'white',
    backgroundColor: '#333', // Button එකේ පාට
    padding: '25px',
    margin: '15px',
    textDecoration: 'none', // යටින් ඉරි එපා
    textAlign: 'center',
    borderRadius: '10px', // Button එක round කරන්න
    transition: 'background-color 0.3s, transform 0.2s',
  },
  // Button එක උඩට mouse එක ගෙනිච්චම වෙන දේ
  // (මේක කෙලින්ම style object එකේ දාන්න බෑ, ඒත් Link එකක් නිසා අවුලක් නෑ)
  // ඔයාට CSS file එකක :hover විදිහට දාන්නත් පුළුවන්
};

export default function SithRooHome() {
  return (
    // අපි උඩ හදපු style එක මෙතන දානවා
    <main style={styles.body}>
      <h1 style={styles.title}>Welcome to SithRoo.Store</h1>

      {/* 1. අලුත් Library එකට Button එක */}
      <Link href="/sithroo-library" style={styles.button}>
        SithRoo library
      </Link>

      {/* 2. පරණ Kitto System එකට Button එක */}
      {/* මේක link වෙන්නේ අපි 1 වෙනි පියවරේ හදපු page එකට */}
      <Link href="/kitto-home" style={styles.button}>
        Kitto
      </Link>
    </main>
  );
}
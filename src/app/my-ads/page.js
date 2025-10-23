import MyAdsPage from '@/components/MyAdsPage';
import Header from '@/components/Header'; // Header එකත් පෙන්නමු
import Footer from '@/components/Footer'; // Footer එකත් පෙන්නමු

export default function UserAdsPage() {
  return (
    <> {/* Header/Footer එක්ක දාන නිසා <main> වෙනුවට <> දානවා */}
      <Header />
      <main className="bg-gray-100 min-h-screen"> {/* Background එක දාන්න main tag එකක් */}
         <MyAdsPage />
      </main>
      <Footer />
    </>
  );
}
import AccountSettingsForm from '@/components/AccountSettingsForm'; // <-- ආපහු import කළා
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen">
        <AccountSettingsForm /> {/* <-- ආපහු මෙතනට දැම්මා */}
      </main>
      <Footer />
    </>
  );
}
import PostAdForm from '@/components/PostAdForm';
import Header from '@/components/Header'; // Header එකත් පෙන්නමු
import Footer from '@/components/Footer'; // Footer එකත් පෙන්නමු

export default function PostAdPage() {
  return (
    <main>
      <Header />
      <PostAdForm />
      <Footer />
    </main>
  );
}
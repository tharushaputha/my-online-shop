import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedAds from "../components/FeaturedAds";
import Footer from "../components/Footer"; // 1. අලුත් component එක import කරගන්නවා

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <FeaturedAds />
      <Footer /> {/* 2. හැමදේටම පහළින් ඒක පෙන්වනවා */}
    </main>
  );
}
// !!! වැදගත්: මෙතනට ඔබේ LIVE URL එක හරියටම දාන්න !!!
const BASE_URL = 'https://sithroo.store'; // 'sitemap.js' එකේ දැම්ම URL එකම දාන්න

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*', // හැම search engine එකකටම (Google, Bing...)
        allow: '/', // මුළු site එකම crawl කරන්න අවසර දෙනවා
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`, // Sitemap එක කොතනද තියෙන්නේ කියලා කියනවා
  }
}
// !!! වැදගත්: මෙතනට ඔයාගේ LIVE URL එක හරියටම දාන්න !!!
// උදාහරණයක්: 'https://yoursite.netlify.app' හෝ 'https://sithroo.store'
const BASE_URL = 'https://sithroo.store/'; 

export default function sitemap() {
  return [
    // 1. ප්‍රධාන SithRoo Home Page එක
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, 
    },
    // 2. Kitto Home (Clasifieds Main Page)
    {
      url: `${BASE_URL}/kitto-home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // 3. Static Pages
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // 4. Legal Pages
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // 5. Library Page
    {
      url: `${BASE_URL}/sithroo-library`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // (ඔයාගේ අනිත් pages - /shop, /ad වගේ - තියෙනවනම් ඒවත් මෙතනට add කරන්න)
  ];
}
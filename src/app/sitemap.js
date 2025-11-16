// ඔයාගේ website එකේ Domain Name එක මෙතන දාන්න
const URL = 'https://sithroo.store'; // (උදාහරණයක්)

export default function sitemap() {
  return [
    {
      url: `${URL}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${URL}/kitto-home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${URL}/sithroo-library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    // ඔයාගේ අනිත් pages (shop, login) තියෙනවනම්
    // ඒවත් මේ විදිහටම add කරන්න
  ];
}
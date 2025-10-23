import React from 'react';
import Link from 'next/link'; // --- 1. Link component එක import කරගන්නවා ---

const categoriesList = [
  // --- 2. හැම category එකකටම URL එකට ගැලපෙන 'slug' එකක් දෙනවා ---
  { name: 'Electronics', icon: '📱', slug: 'electronics' },
  { name: 'Vehicles', icon: '🚗', slug: 'vehicles' },
  { name: 'Property', icon: '🏠', slug: 'property' },
  { name: 'Fashion', icon: '👕', slug: 'fashion-beauty' }, // Slug එකේ space නැතුව '-' දානවා
  { name: 'Pets', icon: '🐶', slug: 'pets-animals' },
  { name: 'Services', icon: '🛠️', slug: 'services' },
  { name: 'Jobs', icon: '💼', slug: 'jobs' },
  { name: 'Other', icon: '...', slug: 'other' },
];

const Categories = () => {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoriesList.map((category) => (
            // --- 3. සම්පූර්ණ div එකම Link එකක් කරනවා ---
            <Link 
              href={`/category/${category.slug}`} // URL එක හදනවා (e.g., /category/electronics)
              key={category.name}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:bg-secondary hover:text-white transition-all group min-h-[120px]"
            >
              <span className="text-5xl mb-3">{category.icon}</span>
              <span className="font-semibold text-center text-gray-700 group-hover:text-white">
                {category.name}
              </span>
            </Link>
            // --- 4. පරණ div එක අයින් කළා ---
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
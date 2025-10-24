// File: app/page.jsx
'use client'; // State use karana nisa client component ekak wenna ona

import React, { useState } from 'react'; // useState import kala
import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedAds from "../components/FeaturedAds";
import FilteredAds from "../components/FilteredAds"; // 1. Aluth component eka import kala
import Footer from "../components/Footer";

export default function Home() {
  // --- 2. Filter values thiyaganna State haduwa ---
  const [filters, setFilters] = useState({
    district: null, // e.g., 'Colombo'
    city: null,     // e.g., 'Nugegoda'
    category: null, // e.g., 'Electronics'
    searchTerm: '', // e.g., 'iphone'
  });
  // ------------------------------------------------

  // --- 3. Hero eken ena filter updates handle karana Function ---
  const handleFiltersChange = (newFilters) => {
    console.log("Homepage received filters:", newFilters);
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };
  // -------------------------------------------------------------

  return (
    <main>
      <Header />
      {/* --- 4. Hero ekata aluth prop eka pass kala --- */}
      <Hero onFiltersChange={handleFiltersChange} />
      {/* ------------------------------------------- */}
      <Categories />
      <FeaturedAds />
      {/* --- 5. Aluth FilteredAds component eka methanata damma --- */}
      {/* Filters set wela nam witharak meka pennanna */}
      {(filters.district || filters.city || filters.category || filters.searchTerm) && (
          <FilteredAds
              district={filters.district}
              city={filters.city}
              category={filters.category}
              searchTerm={filters.searchTerm}
          />
      )}
      {/* ------------------------------------------------------- */}
      <Footer />
    </main>
  );
}
// File: components/FilteredAds.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner'; // Loading spinner import karaganna

// Ad Card component (Shop page eke wage podi card ekak)
const AdCard = ({ ad }) => (
  <Link
    href={`/ad/${ad.id}`}
    className="block bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
  >
    <div className="relative w-full h-40 sm:h-48 bg-gray-200 overflow-hidden"> {/* Height poddak adu kala */}
      {ad.image_urls && ad.image_urls.length > 0 ? (
        <img
          src={ad.image_urls[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
       {ad.is_sold && (<div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">SOLD</div>)}
    </div>
    <div className="p-3 sm:p-4"> {/* Padding poddak adu kala */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-primary">
        {ad.title}
      </h3>
      <p className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2">
        Rs. {ad.price.toLocaleString()}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 truncate">{ad.location}</p> {/* Location pennanna */}
    </div>
  </Link>
);

// Filtered Ads Component එක
const FilteredAds = ({ district, city, category, searchTerm }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    // Filter ekak hari set wela nathnam, fetch karanna epa
    if (!district && !city && !category && (!searchTerm || searchTerm.trim().length < 2)) {
      setAds([]);
      setLoading(false);
      setError(null);
      setNoResults(false); // No filters applied means no results section needed yet
      return;
    }

    const fetchFilteredAds = async () => {
      setLoading(true);
      setError(null);
      setNoResults(false);
      setAds([]); // Clear previous results

      try {
        let query = supabase
          .from('ads')
          .select('*')
          .eq('is_sold', false) // Wikinila nathi ewa witharak
          .order('created_at', { ascending: false }) // Aluth ewa mulata
          .limit(12); // Maximum ads 12k pennamu

        // Filter tika add karamu (thiyenawa nam vitharak)
        if (city) {
          // City name eka Supabase eke 'location' ekata match karamu (Approximate match)
          // Note: Supabase eke 'location' column eke city name eka witharak thiyenna ona meka hariyata wada karanna
          query = query.ilike('location', `%${city}%`);
        } else if (district) {
          // District match karanna Supabase eke wenama 'district' column ekak ona wei
          // Danata api eka ignore karamu, city nathnam okkoma pennamu category/term walata adala
          // Oya Supabase eke 'district' column ekak haduwoth, meka add karanna:
          // query = query.eq('district_name', district);
          console.warn("District filter needs a 'district_name' column in 'ads' table.");
        }

        if (category) {
          query = query.eq('category_name', category);
        }

        if (searchTerm && searchTerm.trim().length >= 2) {
          query = query.ilike('title', `%${searchTerm.trim()}%`); // Title eke search term eka thiyenawada balamu
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          setAds(data);
        } else {
          setAds([]);
          setNoResults(true); // Results na kiyala pennanna
        }

      } catch (err) {
        console.error("Error fetching filtered ads:", err);
        setError(`Could not fetch ads: ${err.message}`);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredAds();

  }, [district, city, category, searchTerm]); // Me filter wenas weddi aye fetch karanna

  // --- Results Pennana Widihata ---

  // Filter set wela nathnam, component eka pennanna epa
  if (!district && !city && !category && (!searchTerm || searchTerm.trim().length < 2)) {
      return null;
  }

  return (
    <section className="py-12 bg-gray-50"> {/* Poddak wena background ekak */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Filtered Results
        </h2>

        {loading && <LoadingSpinner message="Loading filtered ads..." />}
        {error && <p className="text-center text-red-600 py-4">{error}</p>}
        {noResults && !loading && (
          <p className="text-center text-gray-500 py-4">No ads found matching your criteria.</p>
        )}

        {!loading && !error && ads.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
            {/* Mobile walata cols-2 haduwa */}
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredAds;
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import _ from 'lodash';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const router = useRouter();

  // Debounce Function
  const debouncedSearch = useCallback(
    _.debounce(async (term) => {
      if (term.trim().length < 2) { setSuggestions([]); setIsLoadingSuggestions(false); return; }
      setIsLoadingSuggestions(true);
      try {
        const { data, error } = await supabase.from('ads').select('id, title').ilike('title', `${term}%`).eq('is_sold', false).limit(5);
        if (error) { setSuggestions([]); } else { setSuggestions(data || []); }
      } catch (err) { setSuggestions([]); }
      finally { setIsLoadingSuggestions(false); }
    }, 300),
    []
  );

  // Input change effect
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setSuggestions([]);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Suggestion click
  const handleSuggestionClick = (ad) => {
      setSearchTerm(ad.title);
      setSuggestions([]);
      router.push(`/search?q=${encodeURIComponent(ad.title)}`);
  };

  return (
    <section className="bg-white py-16 sm:py-20 text-center relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Text Content and Search Bar */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">
            Find Your Next Treasure
          </h1>
          {/* --- මෙන්න ආපහු දාපු Subheading එක --- */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 mx-auto md:mx-0">
            Discover a vast collection of new and pre-loved items from sellers across Sri Lanka.
          </p>
          {/* --------------------------------- */}

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl md:max-w-md mx-auto md:mx-0">
            <div className="bg-gray-100 p-2 rounded-full flex items-center shadow-inner">
              <input type="text" placeholder="What are you looking for?" className="w-full bg-transparent text-gray-700 focus:outline-none px-4 py-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off" />
              <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity flex-shrink-0">Search</button> {/* Styles ආපහු දැම්මා */}
            </div>
            {/* Suggestions List */}
            { (isLoadingSuggestions || suggestions.length > 0 || (searchTerm.trim().length >= 2 && !isLoadingSuggestions)) && (
              <ul className="absolute left-0 right-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 text-left max-h-60 overflow-y-auto">
                {isLoadingSuggestions && <li className="px-4 py-2 text-gray-500">Searching...</li>}
                {!isLoadingSuggestions && suggestions.map((ad) => (
                  <li key={ad.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(ad)} onMouseDown={(e) => e.preventDefault()}>
                    {ad.title}
                  </li>
                ))}
                {!isLoadingSuggestions && suggestions.length === 0 && searchTerm.trim().length >= 2 && (
                   <li className="px-4 py-2 text-gray-500">No suggestions found.</li>
                )}
              </ul>
            )}
          </form>
        </div>

        {/* Right Side Image */}
        <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
          <Image src="/kitto-hero.png" alt="Hi, I'm Kitto!" width={400} height={400} priority className="max-w-full h-auto"/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // Ensure path is correct
import _ from 'lodash';
import { FaMapMarkerAlt, FaTags, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { FaMobileAlt, FaCar, FaHome, FaTshirt, FaPaw, FaTools, FaBriefcase, FaEllipsisH } from 'react-icons/fa';

// --- Category Data with Icons ---
const categoriesWithIcons = [ { name: 'Electronics', icon: FaMobileAlt }, { name: 'Vehicles', icon: FaCar }, { name: 'Property', icon: FaHome }, { name: 'Fashion & Beauty', icon: FaTshirt }, { name: 'Pets', icon: FaPaw }, { name: 'Services', icon: FaTools }, { name: 'Jobs', icon: FaBriefcase }, { name: 'Home & Garden', icon: FaHome }, { name: 'Education', icon: FaBriefcase }, { name: 'Sports & Kids', icon: FaBriefcase }, { name: 'Other', icon: FaEllipsisH }, ].sort((a, b) => a.name.localeCompare(b.name));

// --- Simple Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 pt-10 sm:pt-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"> <FaTimes size={20} /> </button>
          </div>
          <div className="p-4 overflow-y-auto flex-grow modal-list-scroll">
             {children}
          </div>
        </div>
      </div>
    );
 };

// --- Main Hero Component ---
const Hero = ({ onFiltersChange }) => {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categoriesWithIcons);

  // --- Data Fetching, Debounce, Handlers (Logic - No changes needed) ---
  useEffect(() => { /* Fetch Districts */ const fetchDistricts = async () => { setIsLoadingDistricts(true); const { data, error } = await supabase.from('districts').select('id, name_en').order('name_en'); if (error) console.error("Districts fetch error:", error); else setDistricts(data || []); setIsLoadingDistricts(false); }; fetchDistricts(); }, []);
  const fetchCities = useCallback(async (districtId) => { /* Fetch Cities */ if (!districtId) return; setIsLoadingCities(true); setCities([]); const { data, error } = await supabase.from('cities').select('id, name_en').eq('district_id', districtId).order('name_en'); if (error) console.error("Cities fetch error:", error); else { setCities(data || []); setFilteredCities((data || []).slice(0, 10)); } setIsLoadingCities(false); }, []);
  const triggerFilterUpdate = useCallback( _.debounce((filters) => { if (onFiltersChange) onFiltersChange(filters); else console.warn("onFiltersChange missing"); }, 500), [onFiltersChange] );
  useEffect(() => { triggerFilterUpdate({ district: selectedDistrict?.name_en || null, city: selectedCity?.name_en || null, category: selectedCategory, searchTerm: searchTerm.trim() || null }); }, [selectedDistrict, selectedCity, selectedCategory, searchTerm, triggerFilterUpdate]);
  const debouncedAdSearch = useCallback( _.debounce(async (term) => { /* Ad Suggestion Logic */ if (term.trim().length < 2) { setSuggestions([]); setIsLoadingSuggestions(false); return; } setIsLoadingSuggestions(true); try { let query = supabase.from('ads').select('id, title').ilike('title', `${term}%`).eq('is_sold', false); if (selectedCity) query = query.ilike('location', `%${selectedCity.name_en}%`); if (selectedCategory) query = query.eq('category_name', selectedCategory); const { data, error } = await query.limit(5); if (error) { console.error("Suggest error:", error); setSuggestions([]); } else setSuggestions(data || []); } catch (err) { console.error("Suggest exception:", err); setSuggestions([]); } finally { setIsLoadingSuggestions(false); } }, 300), [selectedDistrict, selectedCity, selectedCategory] );
  useEffect(() => { debouncedAdSearch(searchTerm); return () => debouncedAdSearch.cancel(); }, [searchTerm, debouncedAdSearch]);
  const handleSearchSubmit = (e) => { e.preventDefault(); setSuggestions([]); triggerFilterUpdate.flush(); };
  const handleSuggestionClick = (ad) => { setSearchTerm(ad.title); setSuggestions([]); };
  const handleDistrictSelect = (district) => { setSelectedDistrict(district); setSelectedCity(null); setCitySearchTerm(''); fetchCities(district.id); };
  useEffect(() => { /* City filter logic */ if (selectedDistrict) { const stl = citySearchTerm.toLowerCase(); const allC = cities; const res = stl.length >= 1 ? allC.filter(c => c.name_en.toLowerCase().includes(stl)) : allC.slice(0, 10); setFilteredCities(res.slice(0, 20)); } else setFilteredCities([]); }, [citySearchTerm, cities, selectedDistrict]);
  const handleCitySelect = (city) => { setSelectedCity(city); setShowLocationModal(false); };
  const clearLocation = () => { setSelectedDistrict(null); setSelectedCity(null); setCitySearchTerm(''); setCities([]); setFilteredCities([]); setShowLocationModal(false); };
  const handleOpenLocationModal = () => { setSelectedDistrict(null); setSelectedCity(null); setCitySearchTerm(''); setShowLocationModal(true); setShowCategoryModal(false); };
  useEffect(() => { /* Category filter logic */ const stl = categorySearchTerm.toLowerCase(); const res = stl.length >= 1 ? categoriesWithIcons.filter(c => c.name.toLowerCase().includes(stl)) : categoriesWithIcons; setFilteredCategories(res.slice(0, 20)); }, [categorySearchTerm]);
  const handleCategorySelect = (category) => { setSelectedCategory(category.name); setShowCategoryModal(false); };
  const clearCategory = () => { setSelectedCategory(null); setCategorySearchTerm(''); setShowCategoryModal(false); };
  const handleOpenCategoryModal = () => { setCategorySearchTerm(''); setFilteredCategories(categoriesWithIcons); setShowCategoryModal(true); setShowLocationModal(false); };
  const getLocationButtonText = () => { if (selectedCity) return selectedCity.name_en; if (selectedDistrict) return selectedDistrict.name_en; return 'Select Location'; };


  // --- JSX (Layout Reverted & Cleaned, Colors Fixed to pink-600) ---
  return (
    <>
      <section className="bg-gradient-to-b from-teal-50 via-white to-white py-16 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Main Flex Container */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">

            {/* === Left Side: Content === */}
            <div className="w-full md:w-1/2 lg:w-3/5 text-center md:text-left z-10 order-2 md:order-1 mt-6 md:mt-0">
              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-gray-800 mb-4 leading-tight">
                Find Your Next Treasure
              </h1>
              {/* Subheading */}
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Discover a vast collection of new and pre-loved items from sellers across Sri Lanka.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mx-auto md:mx-0 mb-5 z-20">
                 <div className="bg-white p-2 rounded-full flex items-center shadow-md border border-gray-200">
                    <input type="text" placeholder="What are you looking for?" className="w-full bg-transparent text-gray-700 focus:outline-none px-4 py-2 text-base sm:text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off" />
                    {/* ****** PINK COLOR APPLIED HERE ****** */}
                    <button type="submit" className="bg-primary text-white font-bold py-2.5 px-6 rounded-full hover:bg-pink-700 transition-colors flex-shrink-0 flex items-center"> <FaSearch className="mr-1.5 h-4 w-4" /> Search </button>
                 </div>
                 {/* Suggestions */}
                 {(isLoadingSuggestions || suggestions.length > 0 || (searchTerm.trim().length >= 2 && !isLoadingSuggestions)) && (
                   <ul className="absolute left-0 right-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30 text-left max-h-60 overflow-y-auto">
                     {/* ****** PINK COLOR APPLIED HERE ****** */}
                     {isLoadingSuggestions && <li className="px-4 py-3 text-gray-500 text-center"><FaSpinner className="animate-spin inline mr-2 text-pink-600"/>Searching...</li>}
                     {/* ****** PINK COLOR APPLIED HERE ****** */}
                     {!isLoadingSuggestions && suggestions.map((ad) => ( <li key={ad.id} className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-gray-800" onClick={() => handleSuggestionClick(ad)} onMouseDown={(e) => e.preventDefault()}> {ad.title} </li> ))}
                     {!isLoadingSuggestions && suggestions.length === 0 && searchTerm.trim().length >= 2 && ( <li className="px-4 py-2 text-gray-500">No matching ads found.</li> )}
                   </ul>
                 )}
              </form>

              {/* Location and Category Buttons */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 w-full max-w-xl mx-auto md:mx-0 relative z-10 mt-5">
                  {/* Location Button */}
                  <div className="relative w-full sm:w-auto">
                     {/* ****** PINK COLOR APPLIED HERE ****** */}
                    <button id="location-button" type="button" onClick={handleOpenLocationModal} className="w-full sm:w-auto bg-white text-primary border border-primary font-semibold py-2.5 px-5 rounded-full flex items-center justify-center hover:bg-pink-50 transition duration-150 group shadow-sm text-sm">
                      <FaMapMarkerAlt className="mr-2 flex-shrink-0 h-4 w-4" />
                      <span className="truncate">{getLocationButtonText()}</span>
                      {/* ****** PINK COLOR APPLIED HERE ****** */}
                      {(selectedDistrict || selectedCity) && ( <FaTimes onClick={(e) => { e.stopPropagation(); clearLocation(); }} className="ml-2 text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-3 w-3" title="Clear location"/> )}
                    </button>
                  </div>
                  {/* Category Button */}
                  <div className="relative w-full sm:w-auto">
                     {/* ****** PINK COLOR APPLIED HERE ****** */}
                    <button id="category-button" type="button" onClick={handleOpenCategoryModal} className="w-full sm:w-auto bg-white text-primary border border-primary font-semibold py-2.5 px-5 rounded-full flex items-center justify-center hover:bg-pink-50 transition duration-150 group shadow-sm text-sm">
                      <FaTags className="mr-2 flex-shrink-0 h-4 w-4" />
                      <span className="truncate">{selectedCategory || 'Select Category'}</span>
                      {/* ****** PINK COLOR APPLIED HERE ****** */}
                      {selectedCategory && ( <FaTimes onClick={(e) => { e.stopPropagation(); clearCategory(); }} className="ml-2 text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-3 w-3" title="Clear category"/> )}
                    </button>
                  </div>
              </div>

            </div> {/* === End Left Side === */}

            {/* === Right Side: Image === */}
            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 flex justify-center md:justify-end relative z-0 order-1 md:order-2">
              {/* Image */}
              <Image src="/kitto-hero.png" alt="Kitto Mascot" width={400} height={400} priority className="max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[400px] h-auto drop-shadow-lg" style={{ objectFit: 'contain' }} />
            </div> {/* === End Right Side === */}

          </div> {/* End Main Flex Container */}
        </div> {/* End Container */}
      </section>

      {/* --- Modals (Fixed colors inside) --- */}
      <Modal isOpen={showLocationModal} onClose={clearLocation} title="Select Location">
         {/* ****** PINK COLOR APPLIED HERE ****** */}
         {!selectedDistrict ? ( <> <p className="text-sm text-gray-600 mb-3">Select District:</p> {isLoadingDistricts ? ( <div className="text-center p-4"><FaSpinner className="animate-spin inline mr-2 text-pink-600"/>Loading...</div> ) : ( <ul className="space-y-1 modal-list-scroll"> {districts.map(d => ( <li key={d.id} onClick={() => handleDistrictSelect(d)} className="p-3 hover:bg-pink-50 text-gray-800 cursor-pointer rounded text-base"> {d.name_en} </li> ))} </ul> )} </> ) : ( <> <div className="flex justify-between items-center mb-4"> <p className="font-semibold text-lg text-pink-600">{selectedDistrict.name_en}</p> <button onClick={() => {setSelectedDistrict(null); setCities([]); setFilteredCities([]); setCitySearchTerm('');}} className="text-sm text-gray-500 hover:text-gray-700 font-medium">← Change District</button> </div> <div className="relative mb-3"> <input type="text" placeholder="Search cities..." value={citySearchTerm} onChange={(e) => setCitySearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-base" /> <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> </div> {isLoadingCities ? ( <div className="text-center p-4"><FaSpinner className="animate-spin inline mr-2 text-pink-600"/>Loading...</div> ) : ( <ul className="space-y-1 modal-list-scroll"> {filteredCities.length > 0 ? ( filteredCities.map(c => ( <li key={c.id} onClick={() => handleCitySelect(c)} className="p-3 hover:bg-pink-50 text-gray-800 cursor-pointer rounded text-base"> {c.name_en} </li> )) ) : ( <li className="p-3 text-gray-500 text-sm">No cities found {citySearchTerm ? `for "${citySearchTerm}"` : ''}.</li> )} </ul> )} <p className="text-xs text-gray-400 mt-3">Showing {filteredCities.length} {citySearchTerm ? 'results' : 'top cities'}.</p> </> )}
      </Modal>
      <Modal isOpen={showCategoryModal} onClose={clearCategory} title="Select Category">
          {/* ****** PINK COLOR APPLIED HERE ****** */}
          <div className="relative mb-3"> <input type="text" placeholder="Search categories..." value={categorySearchTerm} onChange={(e) => setCategorySearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-base" /> <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> </div>
          <ul className="space-y-1 modal-list-scroll"> {filteredCategories.length > 0 ? ( filteredCategories.map(cat => ( <li key={cat.name} onClick={() => handleCategorySelect(cat)} className="p-3 hover:bg-pink-50 text-gray-800 cursor-pointer rounded text-base flex items-center"> <cat.icon className="mr-3 text-pink-600 flex-shrink-0"/> {cat.name} </li> )) ) : ( <li className="p-3 text-gray-500 text-sm">No categories found {categorySearchTerm ? `for "${categorySearchTerm}"` : ''}.</li> )} </ul>
           <p className="text-xs text-gray-400 mt-3">Showing {filteredCategories.length} {categorySearchTerm ? 'results' : 'top categories'}.</p>
      </Modal>

      {/* Helper CSS */}
      <style jsx global>{`
        /* Removed speech bubble pointer CSS */
        .modal-list-scroll::-webkit-scrollbar { width: 6px; }
        .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px;}
        .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;}
        .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </>
  );
};

export default Hero;
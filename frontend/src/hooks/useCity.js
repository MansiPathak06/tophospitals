// hooks/useCity.js
// Use this hook in any component (HospitalsPage, HomePage, etc.)
// to read the currently selected city and re-render when it changes.
//
// Usage:
//   const { city, clearCity } = useCity();
//   → filter your hospitals: hospitals.filter(h => h.city === city)

"use client";
import { useState, useEffect } from "react";

const LOC_KEY = "medi_user_city";
 
export function useCity() {
  const [city, setCity] = useState(null);

  useEffect(() => {
    // Read initial value from localStorage
    const saved = localStorage.getItem(LOC_KEY);
    if (saved) setCity(saved);

    // Listen for changes triggered by Navbar's applyCity()
    const handler = (e) => setCity(e.detail.city); 
    window.addEventListener("cityChanged", handler);
    return () => window.removeEventListener("cityChanged", handler);
  }, []);

  const clearCity = () => {
    localStorage.removeItem(LOC_KEY);
    setCity(null);
    window.dispatchEvent(new CustomEvent("cityChanged", { detail: { city: null } }));
  };

  return { city, clearCity };
}
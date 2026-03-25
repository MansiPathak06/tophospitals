import Blogs from '@/components/Blogs';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimoials';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navbar/>
  <Hero/>
      <Blogs/>
      <Testimonials/>
      <Footer/>
      
    </div>
  );
}

export default page;

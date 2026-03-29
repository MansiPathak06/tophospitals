import Blogs from '@/components/Blogs';

import Hero from '@/components/Hero';

import Testimonials from '@/components/Testimoials';
import React from 'react';
import HospitalsPage from './hospitals/page';



const page = () => {
  return (
    <div>
     
  <Hero>
   
  </Hero>
  <HospitalsPage/>
  
      <Blogs/>
      <Testimonials/>
     
      
    </div>
  );
}

export default page;

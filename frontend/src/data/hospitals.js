// data/hospitals.js — swap with API call later

export const hospitals = [
  {
    id: "apollo-moradabad",
    name: "Apollo Hospital",
    verified: true,
    tag: "Best for Heart",
    rating: 4.8,
    reviews: 312,
    address: "Civil Lines, Near MGR Hotel, Moradabad, UP 244001",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.1!2d78.774!3d28.838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUwJzE2LjgiTiA3OMKwNDYnMjYuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
    phone: "+91 98765 43210",
    opening: "8:00 AM",
    closing: "9:00 PM",
    emergency: true,
    specialities: ["Cardiology", "Neurology", "Orthopaedics", "Oncology", "Paediatrics"],
    image: "/images/hospital1.jpg",
    about:
      "Apollo Hospital Moradabad is a premier multi-speciality hospital offering world-class healthcare with state-of-the-art infrastructure and a compassionate team of specialists. Established in 2005, we have served over 2 lakh patients across the region.",
    gallery: ["/images/h1-g1.jpg", "/images/h1-g2.jpg", "/images/h1-g3.jpg"],
    doctors: [
      { name: "Dr. Rajesh Sharma", speciality: "Cardiologist", experience: "18 yrs", image: "/images/doc1.jpg" },
      { name: "Dr. Priya Mehta", speciality: "Neurologist", experience: "12 yrs", image: "/images/doc2.jpg" },
      { name: "Dr. Anil Verma", speciality: "Orthopaedic Surgeon", experience: "15 yrs", image: "/images/doc3.jpg" },
    ],
    timings: [
      { day: "Monday – Friday", time: "8:00 AM – 9:00 PM" },
      { day: "Saturday", time: "9:00 AM – 6:00 PM" },
      { day: "Sunday", time: "Emergency Only" },
    ],
  },
  {
    id: "max-moradabad",
    name: "Max Super Speciality Hospital",
    verified: true,
    tag: "Best for Neuro",
    rating: 4.6,
    reviews: 198,
    address: "Pakbara Road, Ram Ganga Vihar, Moradabad, UP 244001",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.1!2d78.784!3d28.848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUwJzE2LjgiTiA3OMKwNDYnMjYuNCJF!5e0!3m2!1sen!2sin!4v1234567891",
    phone: "+91 91234 56789",
    opening: "7:00 AM",
    closing: "10:00 PM",
    emergency: true,
    specialities: ["Neurology", "Gastroenterology", "Urology", "Dermatology"],
    image: "/images/hospital2.jpg",
    about:
      "Max Super Speciality Hospital brings advanced medical expertise to the people of Moradabad. With cutting-edge diagnostic technology and a dedicated team, we ensure accurate diagnosis and effective treatment for every patient.",
    gallery: ["/images/h2-g1.jpg", "/images/h2-g2.jpg", "/images/h2-g3.jpg"],
    doctors: [
      { name: "Dr. Suresh Gupta", speciality: "Neurologist", experience: "20 yrs", image: "/images/doc4.jpg" },
      { name: "Dr. Kavita Singh", speciality: "Gastroenterologist", experience: "10 yrs", image: "/images/doc5.jpg" },
    ],
    timings: [
      { day: "Monday – Saturday", time: "7:00 AM – 10:00 PM" },
      { day: "Sunday", time: "9:00 AM – 4:00 PM" },
    ],
  },
  {
    id: "fortis-moradabad",
    name: "Fortis Hospital",
    verified: false,
    tag: "Best for Ortho",
    rating: 4.3,
    reviews: 145,
    address: "Delhi Road, Near Bus Stand, Moradabad, UP 244001",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.1!2d78.764!3d28.828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUwJzE2LjgiTiA3OMKwNDYnMjYuNCJF!5e0!3m2!1sen!2sin!4v1234567892",
    phone: "+91 80000 12345",
    opening: "9:00 AM",
    closing: "8:00 PM",
    emergency: false,
    specialities: ["Orthopaedics", "Physiotherapy", "Sports Medicine", "Rheumatology"],
    image: "/images/hospital3.jpg",
    about:
      "Fortis Hospital Moradabad specialises in bone, joint and musculoskeletal care. Our orthopaedic centre is equipped with the latest robotic surgery technology, ensuring minimal recovery times and outstanding outcomes.",
    gallery: ["/images/h3-g1.jpg", "/images/h3-g2.jpg", "/images/h3-g3.jpg"],
    doctors: [
      { name: "Dr. Amit Rana", speciality: "Orthopaedic Surgeon", experience: "14 yrs", image: "/images/doc6.jpg" },
      { name: "Dr. Neha Joshi", speciality: "Physiotherapist", experience: "8 yrs", image: "/images/doc7.jpg" },
    ],
    timings: [
      { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
      { day: "Saturday", time: "9:00 AM – 5:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
   {
    id: "Don't know-moradabad",
    name: "Fortis Hospital",
    verified: false,
    tag: "Best for Ortho",
    rating: 4.3,
    reviews: 145,
    address: "Delhi Road, Near Bus Stand, Moradabad, UP 244001",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.1!2d78.764!3d28.828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUwJzE2LjgiTiA3OMKwNDYnMjYuNCJF!5e0!3m2!1sen!2sin!4v1234567892",
    phone: "+91 80000 12345",
    opening: "9:00 AM",
    closing: "8:00 PM",
    emergency: false,
    specialities: ["Orthopaedics", "Physiotherapy", "Sports Medicine", "Rheumatology"],
    image: "/images/hospital3.jpg",
    about:
      "Fortis Hospital Moradabad specialises in bone, joint and musculoskeletal care. Our orthopaedic centre is equipped with the latest robotic surgery technology, ensuring minimal recovery times and outstanding outcomes.",
    gallery: ["/images/h3-g1.jpg", "/images/h3-g2.jpg", "/images/h3-g3.jpg"],
    doctors: [
      { name: "Dr. Amit Rana", speciality: "Orthopaedic Surgeon", experience: "14 yrs", image: "/images/doc6.jpg" },
      { name: "Dr. Neha Joshi", speciality: "Physiotherapist", experience: "8 yrs", image: "/images/doc7.jpg" },
    ],
    timings: [
      { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
      { day: "Saturday", time: "9:00 AM – 5:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  }, {
    id: "Unknown-moradabad",
    name: "Fortis Hospital",
    verified: false,
    tag: "Best for Ortho",
    rating: 4.3,
    reviews: 145,
    address: "Delhi Road, Near Bus Stand, Moradabad, UP 244001",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.1!2d78.764!3d28.828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDUwJzE2LjgiTiA3OMKwNDYnMjYuNCJF!5e0!3m2!1sen!2sin!4v1234567892",
    phone: "+91 80000 12345",
    opening: "9:00 AM",
    closing: "8:00 PM",
    emergency: false,
    specialities: ["Orthopaedics", "Physiotherapy", "Sports Medicine", "Rheumatology"],
    image: "/images/hospital3.jpg",
    about:
      "Fortis Hospital Moradabad specialises in bone, joint and musculoskeletal care. Our orthopaedic centre is equipped with the latest robotic surgery technology, ensuring minimal recovery times and outstanding outcomes.",
    gallery: ["/images/h3-g1.jpg", "/images/h3-g2.jpg", "/images/h3-g3.jpg"],
    doctors: [
      { name: "Dr. Amit Rana", speciality: "Orthopaedic Surgeon", experience: "14 yrs", image: "/images/doc6.jpg" },
      { name: "Dr. Neha Joshi", speciality: "Physiotherapist", experience: "8 yrs", image: "/images/doc7.jpg" },
    ],
    timings: [
      { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
      { day: "Saturday", time: "9:00 AM – 5:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
];
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const pets = [
  {
    id: 1,
    name: "Charlie",
    age: "3yr",
    image: "https://i.ibb.co/HTvK3FQD/Charlie.jpg",
    description: "Charlie is full of energy and loves his daily walks. He needs a loving owner who can guide him with gentle leadership.",
  },
  {
    id: 2,
    name: "Denise",
    age: "8mo",
    image: "https://i.ibb.co/V0TqKkn3/Denise.jpg",
    description: "Sweet and affectionate, Denise adores cuddles. She'll instantly warm your heart and brighten your days.",
  },
  {
    id: 3,
    name: "Rebecca",
    age: "3yr",
    image: "https://i.ibb.co/8Dy30w6c/Rebecca.jpg",
    description: "Friendly and calm, Rebecca gets along with all pets. She’s a gentle soul ready to join a peaceful, loving home.",
  },
  {
    id: 4,
    name: "Bugs",
    age: "3yr",
    image: "https://i.ibb.co/5XKKLGWH/Bugs.jpg",
    description: "A curious and playful spirit, Bugs is always exploring. He thrives with attention and loves a good adventure.",
  },
  {
    id: 5,
    name: "Doris",
    age: "8mo",
    image: "https://i.ibb.co/MDKk0M3p/Doris.jpg",
    description: "Young, bright, and loving—Doris seeks a family to grow up with. She's full of affection and joy.",
  },
  {
    id: 6,
    name: "Jamie",
    age: "3yr",
    image: "https://i.ibb.co/KzfQ0F3r/Jamie.jpg",
    description: "Jamie is calm and social. She's comfortable around other animals and would make a gentle and loyal friend.",
  },
  {
    id: 7,
    name: "Kevin",
    age: "3yr",
    image: "https://i.ibb.co/b5NnzgsQ/Kevin.jpg",
    description: "Kevin is playful, friendly, and great with kids and pets. He’s waiting for a family to call his own.",
  },
];


const FeaturedPetsSwiper = () => {
  return (
    <section className="py-16 bg-base-100  w-11/12 mx-auto  px-6">
      <div className="text-center mb-10">
        <p className="text-warning uppercase font-medium">Available Pets</p>
        <h2 className="text-4xl font-bold text-primary">Featured Pets</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {pets.map((pet) => (
          <SwiperSlide key={pet.id}>
            <div className="bg-white  bshadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pet.age}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedPetsSwiper;

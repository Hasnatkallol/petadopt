import React, { useEffect, useState } from "react";
import { useParams } from "react-router";


const DetailsPetListing = () => {
  const pets = [
    {
      id: 1,
      name: "Kevin",
      age: "3yr",
      image: "https://i.ibb.co/b5NnzgsQ/Kevin.jpg",
      description: "Kevin is playful, friendly, and great with kids.",
      location: "New York",
      category: "Dog",
      isAdopted: false,
      createdAt: "2024-07-01",
    },
    {
      id: 2,
      name: "Jamie",
      age: "3yr",
      image: "https://i.ibb.co/KzfQ0F3r/Jamie.jpg",
      description: "Jamie is calm and social.",
      location: "San Francisco",
      category: "Cat",
      isAdopted: false,
      createdAt: "2025-06-30",
    },
    {
      id: 3,
      name: "Rep",
      age: "8mo",
      image: "https://i.ibb.co/MDKk0M3p/Doris.jpg",
      description: "Young, bright, and loving—Doris seeks a family.",
      location: "Austin",
      category: "Dog",
      isAdopted: false,
      createdAt: "2022-06-28",
    },
    {
      id: 4,
      name: "Bugs",
      age: "3yr",
      image: "https://i.ibb.co/5XKKLGWH/Bugs.jpg",
      description: "Curious and playful, Bugs loves exploring.",
      location: "Chicago",
      category: "Rabbit",
      isAdopted: true,
      createdAt: "2024-06-20",
    },
    {
      id: 5,
      name: "Rebecca",
      age: "3yr",
      image: "https://i.ibb.co/8Dy30w6c/Rebecca.jpg",
      description: "Friendly and calm, Rebecca gets along with all pets.",
      location: "Los Angeles",
      category: "Cat",
      isAdopted: false,
      createdAt: "2024-06-15",
    },
    {
      id: 6,
      name: "Denise",
      age: "8mo",
      image: "https://i.ibb.co/V0TqKkn3/Denise.jpg",
      description: "Sweet and affectionate, Denise adores cuddles.",
      location: "Seattle",
      category: "Dog",
      isAdopted: false,
      createdAt: "2024-06-10",
    },
    {
      id: 7,
      name: "Charlie",
      age: "3yr",
      image: "https://i.ibb.co/HTvK3FQD/Charlie.jpg",
      description: "Charlie loves walks and needs a gentle owner.",
      location: "Miami",
      category: "Dog",
      isAdopted: true,
      createdAt: "2024-06-01",
    },
    {
      id: 8,
      name: "Doris",
      age: "8mo",
      image: "https://i.ibb.co/MDKk0M3p/Doris.jpg",
      description: "Young, bright, and loving—Doris seeks a family.",
      location: "Austin",
      category: "Dog",
      isAdopted: true,
      createdAt: "2025-07-08",
    },
  ];
  const{id} =useParams()
  const [allpets,setAllpets] = useState(null)
  useEffect(() => {
    const filterData = pets.find((item) => item.id == id);
    setAllpets(filterData);
  }, [id,pets]);

  return (
    <div>
      <h1>{allpets.name}</h1>
    </div>
  );
};

export default DetailsPetListing;

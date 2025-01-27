"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const messages = [
  {
    id: 1,
    title: "Secure Communication",
    description: "All your messages are encrypted end-to-end.",
  },
  {
    id: 2,
    title: "Team Collaboration",
    description: "Collaborate with your team seamlessly.",
  },
  {
    id: 3,
    title: "Fast & Reliable",
    description: "Experience fast and reliable messaging services.",
  },
  {
    id: 4,
    title: "Accessible Everywhere",
    description: "Access your messages on any device, anytime.",
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  return (
    <div className=" flex flex-col items-center justify-center px-4 md:px-24 py-12">
      {/* Header Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome to Mystry Message
        </h1>
        <p className="text-gray-100 mt-2">
          A secure messaging platform for your team
        </p>
      </section>

      {/* Carousel Container */}
      <div className="relative w-full max-w-3xl  overflow-hidden">
        {/* Carousel Content */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {messages.map((message) => (
            <div key={message.id} className="min-w-full flex-shrink-0 px-4">
              <Card className="shadow-lg rounded-xl">
                <CardContent className="text-center p-6">
                  <h2 className="text-2xl font-semibold">{message.title}</h2>
                  <p className="text-gray-500 mt-2">{message.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

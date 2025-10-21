import React from "react";
import EmblaCarousel from "../ReviewCards/EmblaCarousel";
import { type EmblaOptionsType } from "embla-carousel";
import Card1 from "../ReviewCards/Card1";
import Card2 from "../ReviewCards/Card2";
import Card3 from "../ReviewCards/Card3";

type ReviewSectionProps = {
  title: string;
  subtitle: string;
  options?: EmblaOptionsType;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, subtitle, options }) => {
  const slides = [<Card1 />, <Card2 />, <Card3 />];

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-8 bg-gray-50 dark:bg-neutral-900">
      {/* Left side */}
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
      </div>

      {/* Right side carousel */}
      <div className="md:w-1/2 w-full">
        <EmblaCarousel slides={slides} options={options} />
      </div>
    </section>
  );
};

export default ReviewSection;

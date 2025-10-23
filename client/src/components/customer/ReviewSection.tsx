import React, { useEffect, useRef, useState } from "react";
import EmblaCarousel from "../ReviewCards/EmblaCarousel";
import { type EmblaOptionsType } from "embla-carousel";
import Card1 from "../ReviewCards/Card1";
import Card2 from "../ReviewCards/Card2";
import Card3 from "../ReviewCards/Card3";

type ReviewSectionProps = {
  title: string;
  options?: EmblaOptionsType;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, options }) => {
  const slides = [<Card1 />, <Card2 />, <Card3 />];
  const [isVisible, setIsVisible] = useState(false);
  const leftDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (leftDivRef.current) {
      observer.observe(leftDivRef.current);
    }

    return () => {
      if (leftDivRef.current) {
        observer.unobserve(leftDivRef.current);
      }
    };
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-8 bg-gray-50 dark:bg-neutral-900">
      {/* Left side with intersection observer animation */}
      <div
        ref={leftDivRef}
        className={`md:w-1/2 text-center md:text-left pl-12 transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        <h2
          className={`font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-2 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          {title}
        </h2>
      </div>

      {/* Right side carousel */}
      <div className="md:w-1/2 w-full">
        <EmblaCarousel slides={slides} options={options} />
      </div>
    </section>
  );
};

export default ReviewSection;
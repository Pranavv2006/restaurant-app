import React, { useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { usePrevNextButtons, PrevButton, NextButton } from './CaroselArrow'
import { useDotButton, DotButton } from './CarouselDot'
import { type EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
useEmblaCarousel.globalOptions = {loop: true}

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
}

const CarouselSlides: React.FC<PropType> = ({slides, options}) => {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="w-full relative mx-auto">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((imageSrc, index) => (
            <div key={index} className="relative min-w-0 flex-[0_0_100%] h-96 md:h-[32rem]">
              <img
                className="block w-full h-full object-cover rounded-xl"
                src={imageSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <PrevButton
        onClick={onPrevButtonClick}
        className="absolute -left-14 top-1/2 -translate-y-1/2 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50"
      />

      <NextButton
        onClick={onNextButtonClick}
        className="absolute -right-14 top-1/2 -translate-y-1/2 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50"
      />

      {/* Dots — absolutely positioned below the carousel */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-2 z-50">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === selectedIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselSlides;
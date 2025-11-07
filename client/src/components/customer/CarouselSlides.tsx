import React from 'react'
import { type EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import { usePrevNextButtons, PrevButton, NextButton } from './CaroselArrow'
import { useDotButton, DotButton } from './carouselDot'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
}

const CarouselSlides: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="w-full overflow-hidden mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((imageSrc: string, index: number) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <img
                className="block w-full h-auto object-cover rounded-xl"
                src={imageSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        <div className="flex space-x-2">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className='bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow z-20'/>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className='bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow z-20'/>
        </div>

        <div className="flex space-x-2 items-center">
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
    </div>
  )
}

export default CarouselSlides;
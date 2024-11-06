import { ReactNode, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SwipeableHandlers, useSwipeable } from 'react-swipeable';
import classes from './Slider.module.scss';
import { SliderPagination } from './SliderPagination';
import { SliderArrow } from './SliderArrow';
import { classConnection } from '../../utils/function';

export interface IBaseSlide {
    id: string | number;
}

interface IBreakpoint {
    width: number;
    slideToShow: number;
    slideToScroll: number;
}

export interface ISlider<T extends IBaseSlide> {
    name?: string;
    className?: string;
    slideClassName?: string;
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    getCurrentSlide?: (index: number) => void; 
    addArrows?: boolean;
    addDots?: boolean;
    autoplay?: boolean;
    draggable?: boolean;
    looped?: boolean;
    autoplayDelay?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    prevArrow?: ReactNode;
    nextArrow?: ReactNode;
    customArrow?: ReactNode;
    initialSlide?: number;
    breakpoints?: IBreakpoint[];
}

export const Slider = <T extends IBaseSlide>({
    name,
    className,
    slideClassName,
    items = [],
    renderItem,
    getCurrentSlide,
    addArrows = false,
    addDots = false,
    draggable = false,
    autoplay = false,
    looped = false,
    slidesToShow = 1,
    slidesToScroll = 1,
    autoplayDelay = 2000,
    customArrow,
    initialSlide = 0,
    breakpoints

}: ISlider<T>) => {
    const [currentSlide, setCurrentSlide] = useState(initialSlide);
    const [translateX, setTranslateX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isClickable, setIsClickable] = useState(true)
    const [swipeOffset, setSwipeOffset] = useState(0);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [calcSlidesToShow, setCalcSlidesToShow] = useState<number>(slidesToShow)
    const [calcSlidesToScroll, setCalcSlidesToScroll] = useState<number>(slidesToScroll)
    const totalScrolls = useMemo(() => {
        return Math.ceil((items.length - calcSlidesToShow) / calcSlidesToScroll) + 1;
    }, [items.length, calcSlidesToShow, calcSlidesToScroll]);

    useEffect(() => {
        updateTranslateX();
        if (Math.abs(swipeOffset) > 1 && isClickable) setIsClickable(false)
    }, [currentSlide, swipeOffset, isClickable]);

    useEffect(() => {
        if (autoplay && totalScrolls > 1) {
            const intervalId = setInterval(nextSlide, autoplayDelay);
            return () => clearInterval(intervalId);
        }
    }, [items.length, currentSlide, autoplayDelay, autoplay, totalScrolls]);
    const updateTranslateX = () => {
        setTranslateX(-100 * (currentSlide * (calcSlidesToScroll / calcSlidesToShow)) + swipeOffset);
    };

    const changeSlide = (direction: number) => {
        setSwipeOffset(0);
        setIsAnimating(true);
        setIsClickable(true)
        setCurrentSlide((prev) => {
            const newSlide = prev + direction;
            if (looped) {
                return (newSlide + totalScrolls) % totalScrolls;
            }
            return Math.max(0, Math.min(newSlide, totalScrolls - 1));
        });
    };

    const nextSlide = () => changeSlide(1);
    const prevSlide = () => changeSlide(-1);

    let handlers: SwipeableHandlers | undefined = useSwipeable({
        onSwipedLeft: nextSlide,
        onSwipedRight: prevSlide,
        onSwiping: (eventData) => {
            setIsAnimating(false);
            setSwipeOffset((eventData.deltaX / window.innerWidth) * 100);
        },
        preventScrollOnSwipe: false,
        trackMouse: true,
        delta: 20
    });

    const handleMouseLeave = () => {
        setSwipeOffset(0);
        updateTranslateX();
    };
    const isLastSlide = () => !looped && currentSlide >= totalScrolls - 1;
    const isFirstSlide = () => !looped && currentSlide <= 0;

    
    const updateSliderSettings = useCallback(() => {
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.offsetWidth;
            
            if (breakpoints) {
                const matchedBreakpoint = breakpoints
                    .slice()
                    .sort((a, b) => b.width - a.width)
                    .find(b => containerWidth >= b.width);

                if (matchedBreakpoint) {
                    setCalcSlidesToShow(matchedBreakpoint.slideToShow);
                    setCalcSlidesToScroll(matchedBreakpoint.slideToScroll);
                } else {
                    setCalcSlidesToShow(slidesToShow);
                    setCalcSlidesToScroll(slidesToScroll);
                }
            } else {
                setCalcSlidesToShow(slidesToShow);
                setCalcSlidesToScroll(slidesToScroll);
            }
        }
    }, [sliderRef.current, breakpoints]);
    useEffect(() => {
        if(currentSlide !== initialSlide){
            changeSlide(1)
        }
    }, [calcSlidesToScroll, calcSlidesToShow])
    useEffect(() => {
        if (getCurrentSlide) {
            getCurrentSlide(currentSlide)
        }
    }, [currentSlide, getCurrentSlide])
    useEffect(() => {
        updateSliderSettings();
        window.addEventListener('resize', updateSliderSettings);

        return () => {
            window.removeEventListener('resize', updateSliderSettings);
        };
    }, [sliderRef.current, slidesToShow, slidesToScroll, breakpoints]);

    if (!draggable || totalScrolls <= 1) handlers = undefined;
    if (!items.length) return null;


    return (
        <div
            className={classConnection(classes.slider, className)}

            style={{
                cursor: draggable && totalScrolls > 1 ? 'grab' : 'auto',
                userSelect: draggable && totalScrolls > 1 ? 'none' : 'auto',
                paddingBottom: (addDots && totalScrolls > 1) ? '30px' : undefined
            }}
            {...handlers}
            onMouseLeave={draggable && totalScrolls > 1 ? handleMouseLeave : undefined}
            onTouchEnd={draggable && totalScrolls > 1 ? handleMouseLeave : undefined}
            aria-label={name}
        >
            {(addArrows && totalScrolls > 1) && (
                <>
                    <SliderArrow
                        direction="prev"
                        onClick={prevSlide}
                        customArrow={customArrow}
                        className={isFirstSlide() ? classes.slider__arrow_disabled : ''}
                    />
                    <SliderArrow
                        direction="next"
                        onClick={nextSlide}
                        customArrow={customArrow}
                        className={isLastSlide() ? classes.slider__arrow_disabled : ''}
                    />
                </>
            )}

            <div
                className={classes.slider__slides}
                style={{
                    transform: `translateX(${translateX}%)`,
                    transition: isAnimating ? 'transform 0.3s ease' : 'none',
                    pointerEvents: isClickable ? 'auto' : 'none'
                }}
                ref={sliderRef}
            >
                {items.map((item, index) => (
                    <div className={classConnection(classes.slider__slide, slideClassName)} key={item.id} style={{ minWidth: `${100 / calcSlidesToShow}%` }} aria-disabled>
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>

            {(addDots && totalScrolls > 1) && (
                <SliderPagination
                    items={items}
                    currentSlide={currentSlide}
                    pageCount={totalScrolls}
                    setCurrentSlide={setCurrentSlide}
                />
            )}
        </div>
    );
};
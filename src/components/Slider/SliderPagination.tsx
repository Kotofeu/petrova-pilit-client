import classes from './Slider.module.scss'
interface ISliderPagination<T> {
    items: T[];
    currentSlide: number;
    pageCount: number;
    setCurrentSlide: (index: number) => void;
    
}
export const SliderPagination = <T,>({ pageCount, currentSlide, setCurrentSlide }: ISliderPagination<T>) => {
    return (
        <div className={classes.slider__pagination}>

            {[...Array(pageCount)].map((_, index) => {
                const isCurrent = currentSlide === index
                return (
                    <button
                        key={index}
                        className={`${classes.slider__pageButton} ${isCurrent ? classes.slider__pageButton_active : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        type='button'
                        aria-label={`Переключиться на слайд № ${index + 1}`}
                    />
                )

            })}
        </div>
    );
};



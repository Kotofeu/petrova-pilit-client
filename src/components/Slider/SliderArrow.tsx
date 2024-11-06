import { FC, memo } from 'react';
import classes from './Slider.module.scss';
import { classConnection } from '../../utils/function';

interface ISliderArrow {
    direction: 'prev' | 'next';
    onClick: () => void;
    customArrow?: React.ReactNode;
    className?: string
}

export const SliderArrow: FC<ISliderArrow> = memo(({ direction, onClick, customArrow, className }) => {
    return (
        <button
            className={classConnection(classes[`slider__${direction}`], className)}
            onClick={onClick}
            type='button'
            aria-label={`Переключиться на ${direction === 'prev' ? 'предыдущий' : 'следующий'} слайд`}
        >
            {customArrow || (
                <div
                    className={classes[`slider__${direction}ArrowBox`]}
                    aria-hidden
                >
                    <div
                        className={classes[`slider__${direction}Arrow`]}
                        aria-hidden

                    >
                        <span aria-hidden></span>
                        <span aria-hidden></span>
                        <span aria-hidden></span>
                    </div>
                </div>
            )}

        </button>
    );
});
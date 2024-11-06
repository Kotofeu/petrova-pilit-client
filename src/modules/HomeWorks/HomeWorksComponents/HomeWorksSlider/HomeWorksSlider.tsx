import { FC, useEffect } from 'react'
import { Slider } from '../../../../components/Slider'
import { observer } from 'mobx-react-lite'
import { IWork } from '../../../../store';

import classes from './HomeWorksSlider.module.scss'
import { HomeWorkSlide } from '../HomeWorkSlide/HomeWorkSlide'
import { worksStore } from '../../../../store'
import { classConnection } from '../../../../utils/function';

interface IHomeWorksSlider {
    className?: string;
    isLoading?: boolean;
}

export const HomeWorksSlider: FC<IHomeWorksSlider> = observer(({ className, isLoading }) => {
    if (!worksStore.homeWorks.length) {
        return (
            <div className={classConnection(classes.homeWorksSlider_empty, className)}>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
            </div >
        )
    }
    return (
        <Slider
            className={className}
            items={worksStore.homeWorks}
            renderItem={
                (work) =>
                    <HomeWorkSlide
                        className={classes.homeWorksSlider__slide}
                        key={work.id}
                        work={work}
                    />
            }
            breakpoints={[
                {
                    width: 550,
                    slideToShow: 2,
                    slideToScroll: 1,
                },
                {
                    width: 1000,
                    slideToShow: 3,
                    slideToScroll: 1,
                },
            ]}
            addDots
            autoplay
            autoplayDelay={5000}
            draggable
            looped
            slidesToShow={1}
            slidesToScroll={1}

        />)
})
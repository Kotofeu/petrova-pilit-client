import { useNavigate } from 'react-router-dom'
import { FC, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { ID_PARAM, REVIEWS_ROUTE } from '../../../../utils/const/routes'

import { Slider } from '../../../../components/Slider'
import { reviewsStore } from '../../../../store'
import ReviewCard from '../../../../components/ReviewCard/ReviewCard'
import classes from './HomeReviewsSlider.module.scss'
import { classConnection } from '../../../../utils/function'

interface IHomeReviewsSlider {
    className?: string;
    isLoading?: boolean;

}
export const HomeReviewsSlider: FC<IHomeReviewsSlider> = observer(({ className, isLoading }) => {
    const router = useNavigate()

    const onSlideClick = useCallback((event: React.MouseEvent<HTMLElement>, id: number) => {
        event.preventDefault()
        window.scrollTo(0, 0)
        router(`${REVIEWS_ROUTE}/?${ID_PARAM}=${id}`)
    }, [])
    if (!reviewsStore.mainReviews.length) {
        return (
            <div className={classConnection(classes.homeReviewsSlider_empty, className)}>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
                <div className={classConnection(isLoading ? 'loading' : '')}></div>
            </div >
        )
    }
    return (
        <Slider
            className={className}
            items={reviewsStore.mainReviews || []}
            renderItem={
                (review) =>
                    <ReviewCard
                        className={classes.homeReviewsSlider__review}
                        key={review.id}
                        review={review}
                        onClick={(event) => onSlideClick(event, review.id)}
                        isShortCard
                    />
            }
            autoplay
            autoplayDelay={5000}
            slideClassName={classes.homeReviewsSlider__slide}
            addDots
            draggable
            looped
            breakpoints={[
                {
                    width: 700,
                    slideToShow: 2,
                    slideToScroll: 1,
                },
                {
                    width: 1150,
                    slideToShow: 3,
                    slideToScroll: 1,
                },
            ]}
            slidesToShow={1}
            slidesToScroll={1}

        />
    )
})
import { memo, useEffect } from 'react'
import Section from '../../../../components/Section/Section'
import Background from '../../../../assets/images/heart.png';
import classes from './HomeReviewsSection.module.scss'
import { NavLink } from 'react-router-dom';
import { IS_WRITING_PARAM, REVIEWS_ROUTE } from '../../../../utils/const/routes';
import { HomeReviewsSlider } from '../HomeReviewsSlider/HomeReviewsSlider';
import { applicationStore, IGetAllJSON, IReview, IReviewAllJSON, reviewsStore } from '../../../../store';
import { reviewApi } from '../../../../http';
import useRequest from '../../../../utils/hooks/useRequest';
import { useMessage } from '../../../MessageContext';

export const HomeReviewsSection = memo(() => {
    const [
        reviews,
        reviewsIsLoading,
        reviewsError
    ] = useRequest<IReviewAllJSON>(reviewApi.getReviews, {limit: 6});
    const { addMessage } = useMessage()

    useEffect(() => {
        if (reviews?.reviews?.rows.length) {
            reviewsStore.setMainReviews(reviews.reviews.rows)
        }
    }, [reviews])

    useEffect(() => {
        if (reviewsError && reviewsError !== applicationStore.error) {
            applicationStore.setError(reviewsError)
            addMessage(reviewsError, 'error')
        }
    }, [reviewsError])

    return (
        <Section className={classes.homeReviews} backgroundImage={Background}>
            <div className={classes.homeReviews__titleBox}>
                <h2 className={classes.homeReviews__title}>
                    Узнайте, что думают<br /><span> клиенты </span>о моей работе
                </h2>
                <NavLink to={`${REVIEWS_ROUTE}/?${IS_WRITING_PARAM}=${true}`} className={classes.homeReviews__button} onClick={() => window.scrollTo(0, 0)}>
                    <span className={classes.homeReviews__buttonDecoration}>Были у меня? Оставьте свой отзыв!</span>
                </NavLink>
            </div>
            <HomeReviewsSlider className={classes.homeReviews__slider} isLoading={reviewsIsLoading} />
        </Section>
    )
})

import { ReviewsNavbar } from '../ReviewsNavbar/ReviewsNavbar'
import classes from './ReviewsSection.module.scss'
import { ReviewCardImages } from '../ReviewCardImages/ReviewCardImages'
import { applicationStore, IReviewAllJSON, reviewsStore, userStore } from '../../../../store'
import { observer } from 'mobx-react-lite'
import { useSearchParams } from 'react-router-dom'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { ID_PARAM } from '../../../../utils/const/routes'
import { classConnection } from '../../../../utils/function'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { IReviewGetParam, reviewApi } from '../../../../http'
import useRequest from '../../../../utils/hooks/useRequest'
import { useMessage } from '../../../MessageContext'
import Button from '../../../../UI/Button/Button'


export const ReviewsSection: FC = observer(() => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get(ID_PARAM);
    const parsedId = id ? parseInt(id) : undefined;
    const selectedReview = useRef<HTMLDivElement>(null);
    const { addMessage } = useMessage();

    const [currentParam, setCurrentParam] = useState<IReviewGetParam>({
        page: 1,
        limit: 10,
    });

    const [reviews, reviewsIsLoading, reviewsError, _, setFetchParam] =
        useRequest<IReviewAllJSON>(reviewApi.getReviews, currentParam);

    useEffect(() => {
        setCurrentParam(prev => ({ ...prev, reviewId: parsedId }));
    }, [parsedId]);

    useEffect(() => {
        if (reviews?.reviews) {
            reviewsStore.setReviews(reviews.reviews.rows || []);
            if (reviews.page && reviews.page !== currentParam.page) {
                setCurrentParam(prev => ({ ...prev, page: reviews.page }));
            }
        }
    }, [reviews]);

    useEffect(() => {
        if (reviewsError && reviewsError !== applicationStore.error) {
            applicationStore.setError(reviewsError);
            addMessage(reviewsError, 'error');
        }
    }, [reviewsError]);

    useEffect(() => {
        if (selectedReview.current) {
            selectedReview.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
    }, [selectedReview.current]);

    useEffect(() => {
        if (!currentParam.reviewId) {
            window.scrollTo(0, 0);
        }
        setFetchParam(currentParam);
    }, [currentParam]);

    const changePage = useCallback((page: number) => {
        setCurrentParam(prev => ({ ...prev, page, reviewId: undefined }));
    }, []);
    const deleteReview = useCallback(async (id: number) => {
        await reviewsStore.deleteReview(id)
        if (!reviewsStore.error) {
            addMessage('Отзыв удалён', 'message')
        }
        else {
            addMessage(reviewsStore.error, 'error')
        }
    }, [reviewsStore.error, addMessage])
    return (
        <div className={classes.reviewsSection}>
            <ReviewsNavbar className={classes.reviewsSection__navbar} />
            <div className={classes.reviewsSection__list}>
                {
                    reviewsIsLoading
                        ? <>
                            {
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className={classConnection(
                                        classes.reviewsSection__review_empty, 'loading'
                                    )} />
                                ))
                            }
                        </>
                        : <>
                            {
                                reviewsStore.reviews.map(review => (
                                    <div
                                        ref={parsedId === review.id ? selectedReview : null}
                                        key={review.id}
                                    >
                                        {
                                            userStore.isAdmin
                                                ? <Button
                                                    className={classes.reviewsSection__reviewDelete}
                                                    onClick={() => deleteReview(review.id)}
                                                >
                                                    Удалить отзыв
                                                </Button>
                                                : null
                                        }
                                        <ReviewCardImages
                                            className={classConnection(classes.reviewsSection__review, parsedId === review.id ? classes.reviewsSection__review_selected : '')}
                                            review={review}
                                        />
                                    </div>
                                ))
                            }
                        </>
                }

                <Pagination
                    className={classes.reviewsSection__pagination}
                    currentPage={currentParam.page || 1}
                    itemCount={reviews?.reviews?.count || 0}
                    limit={currentParam.limit || 10}
                    onChange={(page) => changePage(page)}
                />
            </div>
        </div>
    )
})

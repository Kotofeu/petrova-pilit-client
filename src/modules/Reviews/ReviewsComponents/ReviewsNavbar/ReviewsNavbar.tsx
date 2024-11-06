import { FC, useCallback, useState } from 'react';
import classes from './ReviewsNavbar.module.scss';
import Button from '../../../../UI/Button/Button';
import { ReviewModal } from '../ReviewModal/ReviewModal';
import { useSearchParams } from 'react-router-dom';
import { IS_WRITING_PARAM } from '../../../../utils/const/routes';
import { IReview, reviewsStore, userStore } from '../../../../store';
import { observer } from 'mobx-react-lite';
import { classConnection } from '../../../../utils/function';
import { COMMENT, DELETED_IDS, IMAGES, IValues, NAME, RATING } from '../ReviewModal/const';
import { useMessage } from '../../../MessageContext';
import useRequest from '../../../../utils/hooks/useRequest';
import { reviewApi } from '../../../../http';
import Loader from '../../../../UI/Loader/Loader';

interface IReviewsNavbar {
    className?: string;
}
export const ReviewsNavbar: FC<IReviewsNavbar> = observer(({ className }) => {
    const [searchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState<boolean>(searchParams.get(IS_WRITING_PARAM) === 'true');
    const [userReview, userReviewIsLoading, e, fetchUserReview]
        = useRequest<IReview | undefined>(reviewApi.getReview)
    const { addMessage } = useMessage();

    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }
    const deleteReview = useCallback(async () => {
        await reviewsStore.deleteReview(undefined, userReview?.user?.id)
        if (!reviewsStore.error) {
            addMessage('Отзыв удалён', 'message')
            closeModal()
            fetchUserReview()
        }
        else {
            addMessage(reviewsStore.error, 'error')
        }
    }, [userReview, reviewsStore.error, addMessage, closeModal, fetchUserReview])
    const reviewHandler = useCallback(async (review: IValues) => {
        let message = '';
        if (userStore.isAdmin) {
            message = 'Отзыв с авито добавлен!'
            await reviewsStore.addAvitoReview(
                {
                    comment: review[COMMENT],
                    rating: review[RATING]
                },
                review[NAME],
                review[IMAGES] || undefined,
            )
        }
        else {
            if (!userReview) {
                message = 'Спасибо за отзыв!'
                await reviewsStore.addReview(
                    {
                        comment: review[COMMENT],
                        rating: review[RATING]
                    },
                    review[NAME],
                    review[IMAGES] || undefined,
                )
            }
            else {
                message = 'Отзыв сохранён'
                await reviewsStore.changeById(
                    {
                        comment: review[COMMENT],
                        rating: review[RATING],
                    },
                    review[DELETED_IDS],
                    review[IMAGES] || undefined,
                )
            }
        }
        if (!reviewsStore.error) {
            addMessage(message, 'complete')
            closeModal()
            fetchUserReview()
        }
        else {
            addMessage(reviewsStore.error, 'error')
        }
    }, [reviewsStore.error, closeModal, userStore.isAdmin, userReview])

    return (
        <>
            <Loader
                className={classes.reviewsNavbar__loader}
                isLoading={userStore.isLoading || userReviewIsLoading || reviewsStore.isLoading}
            />
            <aside className={classConnection(classes.reviewsNavbar, className)}>
                <div className={classes.reviewsNavbar__inner}>
                    <h1 className={classes.reviewsNavbar__title}>
                        Отзывы моих <br />
                        клиентов
                    </h1>
                    <Button
                        className={classes.reviewsNavbar__button}
                        onClick={openModal}
                    >
                        {
                            userStore.isAdmin
                                ? 'Добавить отзыв с авито'
                                : userReview ? 'Редактируйте отзыв' : 'Напишите и свой'
                        }
                    </Button>

                </div>
            </aside>
            <ReviewModal
                userReview={userReview}
                isOpen={isOpen}
                deleteReview={userReview ? deleteReview : undefined}
                closeModal={closeModal}
                action={reviewHandler}
            />
        </>

    );
});
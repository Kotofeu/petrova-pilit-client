import { useMemo, FC, useCallback, useState } from 'react'
import ReviewCard from '../../../../components/ReviewCard/ReviewCard'
import { IReview, IUser, reviewsStore } from '../../../../store'

import classes from './UserReview.module.scss'
import { observer } from 'mobx-react-lite';
import ModalOk from '../../../../components/Modal/ModalOk';
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton';
import Button from '../../../../UI/Button/Button';
import { useMessage } from '../../../MessageContext';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

interface IUserReview {
    user: IUser;
    userReview: IReview
}

export const UserReview: FC<IUserReview> = observer(({ user, userReview }) => {
    // Если number - удалить изображение, число это id изображения
    const [action, setAction] = useState<'deleteReview' | number | undefined>()
    const [review, setReview] = useState<IReview | null>(userReview)
    const { addMessage } = useMessage();
    const images = useMemo(() => {
        if (!review) return null
        if (!review.reviews_images?.length) return null
        return review.reviews_images
    }, [review])
    const userAction = useCallback(async () => {
        if (action && review) {
            let message;
            switch (action) {
                case 'deleteReview':
                    message = 'Вы удалили отзыв'
                    await reviewsStore.deleteReview(review.id)
                    setReview(null)
                    break;
                case (action && Number(action)):
                    message = 'Вы удалили фото'
                    await reviewsStore.deleteImagesByIdAdmin([action])
                    setReview(prev =>
                    (prev ? {
                        ...prev,
                        reviews_images: prev.reviews_images?.filter(image => image.id !== action)
                    } : null)
                    )
                    break;
            }
            if (reviewsStore.error) {
                addMessage(reviewsStore.error, 'error')
            }
            else if (message) {
                addMessage(message, 'message')
            }
        }
    }, [action, reviewsStore, reviewsStore.error, review])
    if (!review) return null
    return (
        <div className={classes.userReview}>
            <ReviewCard
                className={classes.userReview__review}
                review={review}
            >
                <Button
                    className={classes.userReview__deleteReview}
                    title='Удалить отзыв'
                    onClick={() => setAction('deleteReview')}
                >
                    Удалить отзыв
                </Button>
                {
                    images?.length
                        ? <div className={classes.userReview__images}>

                            {images.map((image, index) =>
                                <div
                                    className={classes.userReview__imageBox}
                                    key={image.id}
                                >
                                    <ControllerButton
                                        className={classes.userReview__deleteImage}
                                        type='delete'
                                        onClick={() => setAction(image.id)}
                                        title='Удалить изображение'
                                    />
                                    <ServerImage
                                        className={classes.userReview__image}
                                        src={image.imageSrc || ''}
                                        alt={`Фотография к отзыву пользователя ${user?.name || user?.email} №${index + 1}`}
                                    />

                                    <ServerImage
                                        className={classes.userReview__background}
                                        src={image.imageSrc || ''}
                                        alt={`Фотография к отзыву пользователя ${user?.name || user?.email} №${index + 1}`}
                                        aria-hidden
                                    />
                                </div>
                            )}
                        </div>
                        : null
                }

            </ReviewCard>
            <ModalOk
                isOpen={action !== undefined}
                closeModal={() => setAction(undefined)}
                onOkClick={userAction}
            />
        </div >
    )

})

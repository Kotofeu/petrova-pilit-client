import React, { FC, memo, ReactNode, useMemo } from 'react';
import { IReview } from '../../store';
import StarRating from '../../UI/StarRating/StarRating';
import DateTime from '../../UI/DateTime/DateTime';
import defaultUSerIcon from '../../assets/icons/User-icon.svg';

import classes from './ReviewCard.module.scss';
import { classConnection, userLevel } from '../../utils/function';

interface IReviewCard {
    className?: string;
    review: IReview;
    isShortCard?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    children?: ReactNode;
}

const ReviewCard: FC<IReviewCard> = memo((props) => {
    const { className, review, isShortCard, onClick, children } = props;
    const { user, comment, updatedAt, rating } = review;
    const memoizedChildren = useMemo(() => {
        return children;
    }, [children]);

    if (!rating || !updatedAt) return null;

    return (
        <article
            className={classConnection(
                classes.reviewCard,
                isShortCard ? classes.reviewCard_short : '',
                className
            )}
            onClick={onClick}
        >
            <header className={classes.reviewCard__header}>
                <div className={classes.reviewCard__userIcon}>
                    <img src={user?.imageSrc ? `${process.env.REACT_APP_API_URL_FILE}/${user.imageSrc}` : defaultUSerIcon} alt={user?.name || user?.email} />
                </div>
                <div className={classes.reviewCard__reviewUser}>
                    <h6 className={classes.reviewCard__userName} title={user?.name || user?.email}>{user?.name || user?.email}</h6>
                    <StarRating className={classes.reviewCard__rating} rating={rating} />
                </div>
            </header>
            <div className={classes.reviewCard__level}>
                <span>{`(${userLevel(user?.visitsNumber || null)})`}</span>
                <DateTime className={classes.reviewCard__date} date={updatedAt} />
            </div>
            {
                isShortCard || comment
                    ? <div className={classes.reviewCard__text}>
                        {comment}
                    </div>
                    : null
            }
            <footer className={classes.reviewCard__footer}>

                {
                    memoizedChildren
                }
                {isShortCard && (
                    <div className={classes.reviewCard__lookMore}>
                        Посмотреть подробнее
                    </div>
                )}
            </footer>
        </article>
    );
});

export default ReviewCard;
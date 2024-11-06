import { FC, useEffect, useMemo } from 'react'
import Section from '../../../../components/Section/Section'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom';
import { applicationStore, IReview, IUser, reviewsStore, userStore } from '../../../../store';
import classes from './UserByIdSection.module.scss';
import { UserReview } from '../UserReview/UserReview';
import { USER_ROUTE } from '../../../../utils/const/routes';
import UserCard from '../../../../components/UserCard/UserCard';
import Error404 from '../../../../components/Error404/Error404';
import useRequest from '../../../../utils/hooks/useRequest';
import { reviewApi, userApi } from '../../../../http';
import Loader from '../../../../UI/Loader/Loader';
import { useMessage } from '../../../MessageContext';

export const UserByIdSection: FC = observer(() => {
    const params = useParams();
    const [
        user,
        userIsLoading,
        userError
    ] = useRequest<IUser>(userApi.getUserById, params ? Number(params.id) : undefined);
    const [
        review,
        reviewIsLoading,
        e,
        getReview,
        setReviewId
    ] = useRequest<IReview>(reviewApi.getReviewById, undefined, false);
    const { addMessage } = useMessage()

    useEffect(() => {
        if (userError && userError !== applicationStore.error) {
            applicationStore.setError(userError);
            addMessage(userError, 'error');
        }
    }, [userError])

    useEffect(() => {
        if (user?.review?.id) {
            setReviewId(user.review.id)
        }
    }, [user])
    if (!user && !userIsLoading) {
        return (
            <Error404
                className={classes.userById__noUser}
                text='Пользователь не найден :('
                buttonText='На страницу пользователей'
                page={USER_ROUTE}
            />
        )
    }

    return (
        <Section className={classes.userById}>
            <Loader
                className={classes.userById__loader}
                isLoading={reviewsStore.isLoading || userIsLoading || reviewIsLoading || userStore.isLoading}
            />
            <UserCard
                user={user}
            />
            {
                review && user
                    ? <UserReview
                        user={user}
                        userReview={review}
                    />

                    : null
            }


        </Section>
    )
})

import { memo, FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

import Button from '../../UI/Button/Button'
import {
    HOME_ROUTE,
    ABOUT_ROUTE,
    WORKS_ROUTE,
    REVIEWS_ROUTE,
    POLICY_ROUTE,
    SETTINGS_ROUTE,
    USER_ROUTE,
    ADMIN_ROUTE
} from '../../utils/const/routes';

import classes from './Error404.module.scss';

type page =
    typeof HOME_ROUTE
    | typeof ABOUT_ROUTE
    | typeof WORKS_ROUTE
    | typeof REVIEWS_ROUTE
    | typeof POLICY_ROUTE
    | typeof SETTINGS_ROUTE
    | typeof USER_ROUTE
    | typeof ADMIN_ROUTE


interface IError404 {
    className?: string;
    text?: string;
    buttonText?: string;
    page?: page
}

const Error404: FC<IError404> = memo(({
    className,
    text = 'Страницы не существует ',
    buttonText = 'Вернуться на главную',
    page = HOME_ROUTE
}) => {
    const router = useNavigate();

    const onReturnToUsersClick = useCallback(() => {
        router(page);
    }, [router]);
    return (
        <div className={classes.error404}>
            <h1 className={classes.error404__404}>
                404
            </h1>
            <h2 className={classes.error404__text}>
                {text}
            </h2>
            <Button
                className={classes.error404__button}
                onClick={onReturnToUsersClick}
            >
                {buttonText}
            </Button>
        </div>)
})

export default Error404
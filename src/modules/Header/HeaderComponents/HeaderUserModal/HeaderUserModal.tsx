import { memo, FC, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import defaultImage from '../../../../assets/icons/User-icon.svg'
import { IUser, registrationStore, userStore } from '../../../../store';
import classes from './HeaderUserModal.module.scss'
import { userLevel } from '../../../../utils/function';
import { NavLink, useNavigate } from 'react-router-dom';
import { HOME_ROUTE, ID_PARAM, IS_WRITING_PARAM, REVIEWS_ROUTE, SETTINGS_ROUTE, USER_ROUTE } from '../../../../utils/const/routes';
import Button from '../../../../UI/Button/Button';
import { useMessage } from '../../../MessageContext';
import { HeaderAsideModal } from '../HeaderAsideModal/HeaderAsideModal';
import Loader from '../../../../UI/Loader/Loader';
import { observer } from 'mobx-react-lite';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

interface IHeaderUser {
    user: IUser | null;
    isOpen: boolean;
    closeModal: (isOpen: boolean) => void;
}

export const HeaderUserModal: FC<IHeaderUser> = observer(({ user, isOpen, closeModal }) => {
    const { addMessage } = useMessage();
    const router = useNavigate();
    const onLinkClick = useCallback(() => {
        closeModal(false)
        window.scrollTo(0, 0);
    }, [])
    const onExitClick = useCallback(async () => {
        await userStore.logout()
        if (!userStore.error) {
            addMessage('Ждём вашего возвращения!', 'complete')
            closeModal(false)
            router(`${HOME_ROUTE}`);
            window.scrollTo(0, 0);
        }
        else {
            addMessage(userStore.error, 'error')
        }
    }, [userStore.logout, userStore.error, closeModal])
    return (
        <HeaderAsideModal isOpen={isOpen} closeModal={closeModal}>
            <div className={classes.headerUserModal__imageBox}>
                <ServerImage
                    className={classes.headerUserModal__image}
                    src={user?.imageSrc || defaultImage}
                    alt={user?.name || user?.email || 'Ваш аккаунт'}
                />
            </div>
            <p className={classes.headerUserModal__level}>
                {userLevel(user?.visitsNumber || null)}
            </p>
            <p className={classes.headerUserModal__name}>
                {user?.name || user?.email}
            </p>
            <nav className={classes.headerUserModal__content}>
                <p
                    className={classes.headerUserModal__navItem}
                >
                    {`Количество посещений: ${user?.visitsNumber || 0}`}
                </p>
                <NavLink
                    className={classes.headerUserModal__navLink}
                    to={SETTINGS_ROUTE}
                    onClick={onLinkClick}
                >
                    Настройки
                </NavLink>
                {
                    user?.review?.id
                        ? <NavLink
                            className={classes.headerUserModal__navLink}
                            to={`${REVIEWS_ROUTE}/?${ID_PARAM}=${user?.review?.id}`}
                            onClick={onLinkClick}
                        >
                            Ваш отзыв
                        </NavLink>
                        : <NavLink
                            className={classes.headerUserModal__navLink}
                            to={`${REVIEWS_ROUTE}/?${IS_WRITING_PARAM}=${true}`}
                            onClick={onLinkClick}
                        >
                            Написать отзыв
                        </NavLink>
                }
                <Button
                    className={classes.headerUserModal__navButton}
                    onClick={onExitClick}
                >
                    {
                        userStore.isLoading
                            ? <Loader isLoading />
                            : <>Выйти</>
                    }
                </Button>
            </nav>
            <div
                className={classes.headerUserModal__qrBox}
            >
                <p className={classes.headerUserModal__qrText}>
                    Покажите QR-код мастеру
                </p>
                <QRCodeSVG
                    value={`${process.env.REACT_APP_CLIENT_URL}${USER_ROUTE}/${user?.id}`}
                    title={"Ваш QR Code"}
                    size={260}
                    fgColor={"#000000"}
                    level={"L"}
                    marginSize={0}
                />
                <p className={classes.headerUserModal__qrText}>
                    или сделайте скриншот
                </p>
            </div>

        </HeaderAsideModal>
    )
})
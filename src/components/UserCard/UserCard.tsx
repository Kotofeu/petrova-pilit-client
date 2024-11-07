import { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import defaultUSerIcon from '../../assets/icons/User-icon.svg';
import classes from './UserCard.module.scss';
import { IUser, userStore } from '../../store';
import useDebounce from '../../utils/hooks/useDebounce';
import { useMessage } from '../../modules/MessageContext';
import { classConnection, userLevel } from '../../utils/function';
import Input from '../../UI/Input/Input';
import ControllerButton from '../../UI/ControllerButton/ControllerButton';
import Counter, { CounterButtonType } from '../Counter/Counter';
import Button from '../../UI/Button/Button';
import ModalOk from '../Modal/ModalOk';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTE } from '../../utils/const/routes';


interface IUserCard {
    className?: string;
    user?: IUser;
    isShortCard?: boolean
}
const UserCard: FC<IUserCard> = observer(({ className, user, isShortCard = false }) => {
    const [action, setAction] = useState<'delete' | 'admin' | 'user' | undefined>();
    const [newUserName, setNewUserName] = useState<string>('');
    const [visits, setVisits] = useState<number | undefined | null>();
    const debounceVisit = useDebounce(visits, 300);
    const [isNewName, setIsNewName] = useState<boolean>(false);
    const router = useNavigate();

    const { addMessage } = useMessage();

    const userAction = useCallback(async (customAction?: string) => {
        if (user) {
            switch (action) {
                case 'delete':
                    await userStore.deleteUserById(user.id);
                    router(USER_ROUTE)
                    break;
                case 'admin':
                    await userStore.giveRole(user.id, "ADMIN");
                    user.role = 'ADMIN'
                    break;
                case 'user':
                    await userStore.giveRole(user.id, "USER");
                    user.role = 'USER'
                    break;
                default:
                    break;
            }
            switch (customAction) {
                case 'name':
                    await userStore.changeUserById(user.id, { ...user, name: newUserName });
                    break;
                case 'visits':
                    await userStore.changeUserById(user.id, { ...user, visitsNumber: debounceVisit });
                    break;
                default:
                    break;
            }
            if (!userStore.error) {
                addMessage('Изменения внесены', 'message');
            }
            else {
                addMessage(userStore.error, 'error');
            }
        }
        else {
            addMessage('Пользователь не найден', 'error');
        }
        setAction(undefined)
    }, [user, action, newUserName, userStore.error, debounceVisit]);

    const newNameHandler = useCallback(async () => {
        if (isNewName) {
            if (newUserName !== user?.name) {
                userAction('name')
            }
            setIsNewName(false);
        } else {
            setIsNewName(true);
        }
    }, [isNewName, newUserName, user, addMessage]);
    useEffect(() => {
        if (debounceVisit && debounceVisit !== user?.visitsNumber && debounceVisit >= 0) {
            userAction('visits')
        }
    }, [debounceVisit, user]);

    useEffect(() => {
        if (user) {
            setNewUserName(user.name || '');
            setVisits(user.visitsNumber || 0);
        }
    }, [user]);

    const onLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
    }, []);

    return (
        <>
            <article className={classConnection(
                classes.userCard,
                isShortCard ? classes.userCard_short : '',
                className

            )}>
                {
                    isShortCard && user?.visitsNumber
                        ? <span className={classes.userCard__userVisits}>
                            {user.visitsNumber}
                        </span>
                        : null

                }
                <div
                    className={classes.userCard__imageBox}
                >
                    <img
                        className={classes.userCard__userImage}
                        src={
                            user?.imageSrc
                                ? `${process.env.REACT_APP_API_URL_FILE}/${user.imageSrc}`
                                : defaultUSerIcon
                        }
                        alt={user?.name || 'Фото пользователя'}
                    />
                    <p className={classes.userCard__userLevel}>
                        {userLevel(user?.visitsNumber || null)}
                    </p>

                </div>
                <div className={classes.userCard__content}>
                    <div className={classes.userCard__fields}>

                        {
                            !!user?.name || !isShortCard
                                ? <div className={classes.userCard__field}>
                                    <p className={classes.userCard__fieldName}>
                                        Имя:
                                    </p>
                                    {
                                        !isShortCard
                                            ? <div className={classes.userCard__fieldFlex}>
                                                <Input
                                                    className={classes.userCard__fieldValue}
                                                    value={newUserName}
                                                    onChange={(event) => setNewUserName(event.target.value)}
                                                    disabled={!isNewName}
                                                />
                                                <ControllerButton
                                                    className={classes.userCard__nameBtn}
                                                    type={isNewName ? 'save' : 'edit'}
                                                    title='Задать новое имя пользователю'
                                                    onClick={newNameHandler}
                                                />
                                            </div>
                                            : <p className={classes.userCard__fieldValue}>{user?.name}</p>
                                    }
                                </div>
                                : null
                        }

                        {
                            user?.email
                                ? <div className={classes.userCard__field}>
                                    <p className={classes.userCard__fieldName}>
                                        Эл. почта:
                                    </p>
                                    <a
                                        className={classes.userCard__fieldValue}
                                        href={`mailto:${user.email}`}
                                        target="_blank"
                                        title='Почта пользователя'
                                        aria-label='Почта пользователя'
                                        rel="noopener noreferrer"
                                        onClick={(event) => onLinkClick(event)}
                                    >
                                        {user.email}
                                    </a>
                                </div>
                                : null
                        }
                        {
                            user?.phone
                                ? <div className={classes.userCard__field}>
                                    <p className={classes.userCard__fieldName}>
                                        Телефон:
                                    </p>
                                    <a
                                        className={classes.userCard__fieldValue}
                                        href={`tel:${user.phone}`}
                                        target="_blank"
                                        title='Телефон пользователя'
                                        aria-label='Телефон пользователя'
                                        rel="noopener noreferrer"
                                        onClick={(event) => onLinkClick(event)}

                                    >
                                        {user.phone}
                                    </a>
                                </div>
                                : null
                        }
                    </div>
                    {
                        !isShortCard
                            ? <footer
                                className={classes.userCard__footer}
                            >

                                <Counter
                                    className={classes.userCard__counter}
                                    count={visits || 0}
                                    setCount={setVisits}
                                    step={1}
                                    minCount={0}
                                    maxCount={99}
                                    counterButtonType={CounterButtonType.arrow}

                                />

                                <div className={classes.userCard__buttons}>
                                    <Button
                                        className={classes.userCard__button}
                                        onClick={() => setAction('delete')}
                                        title='Удалить пользователя'
                                    >
                                        Удалить
                                    </Button>
                                    <Button
                                        className={
                                            classConnection(
                                                user?.role === 'ADMIN' ? classes.userCard__button_active : '',
                                                classes.userCard__button)
                                        }
                                        onClick={() => setAction(user?.role === 'ADMIN' ? 'user' : 'admin')}
                                        title='Назначить админом'
                                    >
                                        Админ
                                    </Button>
                                </div>
                            </footer>
                            : null
                    }


                </div>

            </article>
            <ModalOk
                isOpen={!!action}
                closeModal={() => setAction(undefined)}
                onOkClick={userAction}
            />
        </>
    )
})

export default UserCard
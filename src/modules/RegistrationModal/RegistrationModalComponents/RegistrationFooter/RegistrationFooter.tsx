import { observer } from 'mobx-react-lite'
import { AUTHORIZATION, PASSWORD_RECOVERY, REGISTRATION, registrationStore } from '../../../../store'
import Button from '../../../../UI/Button/Button'
import classes from './RegistrationFooter.module.scss'
import PolicyAgree from '../../../../UI/PolicyAgree/PolicyAgree'


export const RegistrationFooter = observer(() => {
    const onButtonClick = () => {
        registrationStore.actionType === REGISTRATION
            ? registrationStore.setActionType(AUTHORIZATION)
            : registrationStore.setActionType(REGISTRATION)
    }

    return (
        <footer className={classes.registrationFooter}>
            <div className={classes.registrationFooter__item}>
                <p>
                    {registrationStore.actionType === REGISTRATION ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}
                </p>
                <Button
                    className={classes.registrationFooter__button}
                    onClick={onButtonClick}
                >
                    {registrationStore.actionType === REGISTRATION ? 'Войти' : 'Создать'}
                </Button>
            </div>
            {
                registrationStore.actionType === AUTHORIZATION &&
                <div className={classes.registrationFooter__item}>
                    <p>
                        Забыли пароль?
                    </p>
                    <Button
                        className={classes.registrationFooter__button}
                        onClick={() => registrationStore.setActionType(PASSWORD_RECOVERY)}
                    >
                        Восстановить
                    </Button>
                </div>
            }
            {
                registrationStore.actionType === REGISTRATION
                    ? <PolicyAgree
                        className={classes.registrationFooter__policy}
                        agreeWith='При регистрации'
                    />
                    : null
            }
        </footer>

    )
})
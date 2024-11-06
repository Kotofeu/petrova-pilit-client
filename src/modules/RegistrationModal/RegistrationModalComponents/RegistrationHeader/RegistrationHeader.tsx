import { FC, useCallback, useEffect, useState } from 'react'
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton'
import classes from './RegistrationHeader.module.scss'
import { observer } from 'mobx-react-lite'
import { AUTHORIZATION, emailConfirmStore, PASSWORD_RECOVERY, REGISTRATION, registrationStore } from '../../../../store';

interface IRegistrationHeader {
    email?: string | null;
    isEmailConfirm?: boolean | null;
    password?: string | null;
    setIsEmailConfirm: (isConfirm: boolean) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    closeModal: () => void;
}

const RegistrationHeader: FC<IRegistrationHeader> = observer(({
    email,
    isEmailConfirm,
    password,
    setIsEmailConfirm,
    setEmail,
    setPassword,
    closeModal
}) => {
    const [title, setTile] = useState<string>('')
    const isRegOrRec =
        registrationStore.actionType === REGISTRATION ||
        registrationStore.actionType === PASSWORD_RECOVERY
    useEffect(() => {
        setTile(
            registrationStore.actionType === REGISTRATION
                ? 'Регистрация'
                : registrationStore.actionType === AUTHORIZATION
                    ? 'Авторизация'
                    : registrationStore.actionType === PASSWORD_RECOVERY
                        ? 'Восстановление'
                        : ''
        );
    }, [registrationStore.actionType])
    const onBackClick = useCallback(() => {
        if (email && (isRegOrRec)) {
            emailConfirmStore.setEmail('')
            setIsEmailConfirm(false)
            setEmail('')
            setPassword('')
        }
        else {
            closeModal()
        }
    }, [email, isEmailConfirm, password])

    return (
        <header className={classes.registrationHeader} >
            <h3 className={classes.registrationHeader__title}>
                <ControllerButton
                    className={classes.registrationHeader__back}
                    onClick={onBackClick}
                    type='back'
                />
                <span>

                    {title}
                </span>
            </h3>
            {
                isRegOrRec
                    ? <div className={classes.registrationHeader__progress}>
                        <span className={classes.registrationHeader__complete} />
                        <span className={!!email ? classes.registrationHeader__complete : ''} />
                        <span className={!!email && !!isEmailConfirm ? classes.registrationHeader__complete : ''} />
                    </div>
                    : null
            }
        </header>
    )
})

export default RegistrationHeader
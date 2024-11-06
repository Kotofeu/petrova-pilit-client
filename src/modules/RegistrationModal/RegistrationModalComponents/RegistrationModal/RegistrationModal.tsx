import { FC, useCallback, useEffect, useState } from 'react'

import { observer } from 'mobx-react-lite'
import ModalSend from '../../../../components/Modal/ModalSend'
import {
    registrationStore,
    REGISTRATION,
    AUTHORIZATION,
    PASSWORD_RECOVERY,
    emailConfirmStore,
    userStore,
} from '../../../../store'

import { useMessage } from '../../../MessageContext'
import EmailField from '../../../../components/EmailField/EmailField'
import NewPassword from '../../../../components/NewPassword/NewPassword'
import classes from './RegistrationModal.module.scss'

import { RegistrationFooter } from '../RegistrationFooter/RegistrationFooter'
import { RegistrationBlock } from '../RegistrationBlock/RegistrationBlock'
import RegistrationHeader from '../RegistrationHeader/RegistrationHeader'
import AuthBlock from '../AuthBlock/AuthBlock'
import Loader from '../../../../UI/Loader/Loader'
import CodeConfirm from '../../../../components/CodeConfirm/CodeConfirm'

export const RegistrationModal: FC = observer(() => {

    const [email, setEmail] = useState<string>('')
    const [isEmailConfirm, setIsEmailConfirm] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    const { addMessage } = useMessage();

    const isAuth = registrationStore.actionType === AUTHORIZATION
    const isRegN = registrationStore.actionType === REGISTRATION
    const isRecY = registrationStore.actionType === PASSWORD_RECOVERY

    useEffect(() => {
        if (registrationStore.isOpen) {
            registrationStore.setActionType(AUTHORIZATION)
        }
    }, [registrationStore.isOpen])

    useEffect(() => {
        emailConfirmStore.setEmail('')
        setEmail('')
        setIsEmailConfirm(false)
        setPassword('')
        if (registrationStore.isOpen && !registrationStore.actionType) {
            addMessage('Возникла непредвиденная ошибка открытия окна регистрации', 'error')
        }
    }, [registrationStore.actionType, registrationStore.isOpen, emailConfirmStore.setEmail])

    const closeModal = useCallback(() => {
        registrationStore.setIsOpen(false)
    }, [registrationStore])

    const sendCode = useCallback(async () => {
        if (isRecY) {
            await emailConfirmStore.recoverSendCode()
        }
        else if (isRegN) {
            await emailConfirmStore.createSendCode()
        }
        else {
            addMessage('Возникла непредвиденная ошибка открытия окна регистрации', 'error')
        }
        if (emailConfirmStore.error) {
            addMessage(emailConfirmStore.error, 'error')
            setEmail('')
        }
    }, [isRecY, isRegN, isAuth, emailConfirmStore.error, setEmail])

    const changeEmail = useCallback(async (email?: string) => {
        if (email) {
            emailConfirmStore.setEmail(email)
            await sendCode()
            if (!emailConfirmStore.error) {
                setEmail(email)
            }
        }
    }, [emailConfirmStore.setEmail, sendCode, emailConfirmStore.error, setEmail])

    const postRequest = useCallback(async () => {
        if (password && email) {
            if (isRegN) {
                const user = await registrationStore.registration(password)
                userStore.setUser(user?.user || null);
            }
            if (isAuth) {
                const user = await registrationStore.login({ email, password });
                userStore.setUser(user?.user || null);
            }
            if (isRecY) {
                const user = await registrationStore.recoverUser(password);
                userStore.setUser(user?.user || null);
            }
            if (!registrationStore.error) {
                closeModal()
            }
            else {
                addMessage(registrationStore.error, 'error')
            }
        }
        else {
            addMessage('Поле пароля или электронной почты некорректны', 'error')
        }
    }, [email, password, isRecY, isRegN, isAuth, registrationStore.error])

    return (
        <ModalSend
            className={classes.registrationModal}
            isOpen={registrationStore.isOpen && registrationStore.actionType !== null}
            closeModal={closeModal}
            send={(email && isEmailConfirm) || registrationStore.actionType === AUTHORIZATION
                ? postRequest
                : undefined
            }
            isButtonDisabled={!password || !email || emailConfirmStore.isLoading || registrationStore.isLoading}
            buttonText='Завершить'
        >

            <Loader
                className={classes.registrationModal__loader}
                isLoading={emailConfirmStore.isLoading || registrationStore.isLoading}
            />
            <RegistrationHeader
                email={email}
                isEmailConfirm={isEmailConfirm}
                password={password}
                setEmail={setEmail}
                setIsEmailConfirm={setIsEmailConfirm}
                setPassword={setPassword}
                closeModal={closeModal}
            />
            <RegistrationBlock
                isShowing={isAuth}
                title='Укажите данные для входа'
            >
                <AuthBlock
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                />
            </RegistrationBlock>

            <RegistrationBlock
                isShowing={!email && !isAuth}
                title='Укажите адрес электронной почты'
            >
                <EmailField
                    className={classes.registrationModal__emailField}
                    inputClassName={classes.registrationModal__emailInput}
                    onConfirm={changeEmail}
                />
            </RegistrationBlock>

            <RegistrationBlock
                isShowing={!isEmailConfirm && !!email && !isAuth}
                title={`Подтвердите адрес электронной почты: ${email}`}
            >
                <CodeConfirm
                    onConfirm={setIsEmailConfirm}
                    sendCode={sendCode}
                />
            </RegistrationBlock>

            <RegistrationBlock
                isShowing={!!email && isEmailConfirm && !isAuth}
                title='Придумайте новый пароль'
            >
                <NewPassword
                    setNewPassword={(password) => setPassword(password)}
                />
            </RegistrationBlock>

            <RegistrationFooter />
        </ModalSend>

    )
})
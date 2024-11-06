import { useState, FC, useCallback, useEffect } from 'react'
import { SettingsRow } from '../SettingsRow/SettingsRow'
import ModalSend from '../../../../components/Modal/ModalSend';
import CodeConfirm from '../../../../components/CodeConfirm/CodeConfirm';
import { emailConfirmStore, userStore } from '../../../../store';
import { observer } from 'mobx-react-lite';
import EmailField from '../../../../components/EmailField/EmailField';


import classes from './SettingsEmailInput.module.scss'
import { classConnection } from '../../../../utils/function';
import { useMessage } from '../../../MessageContext';
interface ISettingsEmailInput {
    className?: string;
    inputClassName?: string;
    emailFieldClassName?: string;
    email: string;
}
export const SettingsEmailInput: FC<ISettingsEmailInput> = observer(({
    className, inputClassName, emailFieldClassName, email
}) => {
    const [emailConfirmOpen, setEmailConfirmOpen] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [newEmail, setNewEmail] = useState<string>('')
    const { addMessage } = useMessage();

    const sendCode = useCallback(async (enterEmail?: string) => {
        await emailConfirmStore.changeSendCode(enterEmail || newEmail)
        if (emailConfirmStore.error) {
            addMessage(emailConfirmStore.error, 'error')
            emailConfirmStore.setEmail('')
            setNewEmail('')
            setEmailConfirmOpen(false)
        }
    }, [emailConfirmStore.changeSendCode, newEmail, emailConfirmStore.error, emailConfirmStore.setEmail])

    const onConfirmClick = useCallback(async (enterEmail: string) => {
        if (email !== emailConfirmStore.email) {
            emailConfirmStore.setEmail(email)
        }
        await sendCode(enterEmail)
        if (!emailConfirmStore.error) {
            setEmailConfirmOpen(true)
            setError('')
            setNewEmail(enterEmail)
        }
    }, [email, emailConfirmStore.error, sendCode])
    const onConfirm = useCallback(async (isConfirm: boolean) => {
        if (isConfirm) {
            await userStore.setUserEmail(newEmail)
            if (userStore.error) {
                addMessage(userStore.error, 'error')
            }
            setEmailConfirmOpen(false)
        }
    }, [emailConfirmStore.email, userStore.setUserEmail, newEmail])
    const onError = useCallback((error: string) => {
        setError(error)
    }, [])
    return (
        <>
            <SettingsRow
                className={className}
                title='Электронная почта'
                subtitle='Вам будет отрпавлен код подтверждения'
                error={error}
            >
                <EmailField
                    className={classConnection(classes.settingsEmailInput, emailFieldClassName)}
                    inputClassName={inputClassName}
                    email={email}
                    onConfirm={onConfirmClick}
                    onError={onError}
                />
            </SettingsRow>
            <ModalSend
                isOpen={emailConfirmOpen}
                closeModal={() => setEmailConfirmOpen(false)}
            >
                <h4 className={classes.settingsEmailInput__modalTitle}>Мы отправили Вам<br />  код на электронную почту</h4>
                <h5 className={classes.settingsEmailInput__modalEmail}>{newEmail}</h5>
                <CodeConfirm
                    onConfirm={onConfirm} sendCode={sendCode}
                />
            </ModalSend>
        </>

    )
})
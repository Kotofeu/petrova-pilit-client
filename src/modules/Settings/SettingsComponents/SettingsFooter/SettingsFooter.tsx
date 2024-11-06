import { memo, FC, useCallback, useState } from 'react'
import Button from '../../../../UI/Button/Button'
import classes from './SettingsFooter.module.scss'
import ModalSend from '../../../../components/Modal/ModalSend'
import ModalOk from '../../../../components/Modal/ModalOk'
import { useNavigate } from 'react-router-dom'
import { HOME_ROUTE } from '../../../../utils/const/routes'
import { userStore } from '../../../../store'
import { observer } from 'mobx-react-lite'
import { useMessage } from '../../../MessageContext'
import NewPassword from '../../../../components/NewPassword/NewPassword'


interface ISettingsFooter {

}
export const SettingsFooter: FC<ISettingsFooter> = observer(() => {

    const [areUShure, setAreUShure] = useState<boolean>(false)
    const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const router = useNavigate();
    const { addMessage } = useMessage();

    const onChangePasswordConfirm = useCallback(async () => {
        if (password.length) {
            await userStore.setUserPassword(password)
            if (!userStore.error) {
                setIsPasswordChange(false)
                addMessage('Ваш пароль изменён!', 'complete')
            }
            else {
                addMessage(userStore.error, 'error')
            }
        }
    }, [password, userStore.error, userStore.setUserPassword, setIsPasswordChange])
    const onExitClick = useCallback(async () => {
        await userStore.logout()
        if (!userStore.error) {
            router(`${HOME_ROUTE}`);
            addMessage('Ждём вашего возвращения!', 'complete')
        }
        else {
            addMessage(userStore.error, 'error')
        }
    }, [userStore.error, userStore.logout, router])

    const deleteAccount = useCallback(async () => {
        await userStore.deleteUser()
        if (!userStore.error) {
            router(`${HOME_ROUTE}`);
            addMessage('Ваш аккаунт удалён(', 'complete')
        }
        else {
            addMessage(userStore.error, 'error')
        }
    }, [userStore.error, userStore.deleteUser, router])
    return (
        <footer className={classes.settingsFooter}>
            <div className={classes.settingsFooter__footerFlex}>
                <Button
                    className={classes.settingsFooter__footerBtn}
                    type='button'
                    onClick={onExitClick}
                    title='Выйти из аккаунта'
                    disabled={userStore.isLoading}

                >
                    Выйти
                </Button>
                <Button
                    className={classes.settingsFooter__footerBtn}
                    type='button'
                    onClick={() => setIsPasswordChange(true)}
                    title='Сменить пароль'
                    disabled={userStore.isLoading}

                >
                    Сменить пароль
                </Button>
            </div>
            <Button
                className={classes.settingsFooter__footerBtn}
                type='button'
                onClick={() => setAreUShure(true)}
                title='Удалить аккаунт'
                disabled={userStore.isLoading}
            >
                Удалить аккаунт
            </Button>
            <ModalOk
                isOpen={areUShure}
                closeModal={() => setAreUShure(false)}
                onOkClick={deleteAccount}
            />
            <ModalSend
                isOpen={isPasswordChange}
                closeModal={() => setIsPasswordChange(false)}
                send={onChangePasswordConfirm}
                isButtonDisabled={password.length === 0 || userStore.isLoading}
                buttonText='Сменить'
            >
                <h4 className={classes.settingsFooter__modalTitle}>Придумайте пароль</h4>
                <NewPassword
                    setNewPassword={setPassword}
                />
            </ModalSend>
        </footer>
    )
})

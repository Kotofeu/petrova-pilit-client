import classes from './SettingsSection.module.scss'
import Section from '../../../../components/Section/Section'
import { observer } from 'mobx-react-lite'
import { emailConfirmStore, registrationStore, userStore } from '../../../../store'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { UserCropper } from '../UserCropper/UserCropper'
import { useMessage } from '../../../MessageContext'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input/input';
import Input from '../../../../UI/Input/Input'
import { SettingsFooter } from '../SettingsFooter/SettingsFooter'
import { SettingsRow } from '../SettingsRow/SettingsRow'
import { SettingsEmailInput } from '../SettingsEmailInput/SettingsEmailInput'
import useDebounce from '../../../../utils/hooks/useDebounce'
import { MAX_NAME_LENGTH } from '../../../Reviews/ReviewsComponents/ReviewModal/const'
import { classConnection } from '../../../../utils/function'
import Loader from '../../../../UI/Loader/Loader'
export const SettingsSection = observer(() => {

    const { addMessage } = useMessage();

    const [userImage, setUserImage] = useState<File | null>()
    const [userName, setUserName] = useState<string>(userStore.user?.name || '')
    const [userPhone, setUserPhone] = useState<string>(userStore.user?.phone || '')


    const debouncePhone = useDebounce<string>(userPhone, 800)
    const debounceName = useDebounce<string>(userName, 1500)

    useEffect(() => {
        if (userStore.user?.phone) {
            setUserPhone(userStore.user.phone)
        }
    }, [userStore.user?.phone])

    useEffect(() => {
        if (userStore.user?.name) {
            setUserName(userStore.user.name)
        }
    }, [userStore.user?.name])

    useEffect(() => {
        if (userImage !== undefined) {
            userAction('image',
                userImage
                    ? 'Новое фото загружено'
                    : 'Фото удалено'
            )
        }
    }, [userImage])


    const userAction = useCallback(async (action: 'name' | 'phone' | 'phoneDel' | 'image', message: string) => {
        if (userStore.user) {
            switch (action) {
                case 'name':
                    await userStore.setUserName(debounceName);
                    break;
                case 'phone':
                    await userStore.setUserPhone(debouncePhone);
                    break;
                case 'phoneDel':
                    await userStore.setUserPhone('');
                    break;
                case 'image':
                    await userStore.setUserImage(userImage || null)
                    break;
                default:
                    break;
            }
            if (!userStore.error) {
                addMessage(message, 'complete');
            }
            else {
                addMessage(userStore.error, 'error');
            }
        }
    }, [userStore.user, addMessage, userStore.error, debounceName, debouncePhone, debouncePhone, userImage])

    useEffect(() => {
        if (debounceName) {
            if (userStore.user?.name !== debounceName) {
                if (debounceName.length >= 2 && debounceName.length <= MAX_NAME_LENGTH) {
                    userAction('name', `Ваше имя обновлено, ${debounceName}`)
                }
            }
        }
        else {
            if (userStore.user?.name) {
                userAction('name', `Ваше имя заменено на электронную почту`)
            }
        }
    }, [debounceName])
    useEffect(() => {
        if (debouncePhone && isValidPhoneNumber(debouncePhone) && userStore.user?.phone !== debouncePhone) {
            userAction('phone', `Номер телефона обновлён`)
        }
        else if (!debouncePhone && userStore.user?.phone) {
            userAction('phoneDel', `Номер телефона удалён`)

        }
    }, [debouncePhone])

    const userImageHandler = useCallback((image: File | null) => {
        setUserImage(image)
    }, [])

    const userNameHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > MAX_NAME_LENGTH) {
            return
        }
        setUserName(event.target.value)

    }, [])

    const userPhoneHandler = useCallback((value: any) => {
        setUserPhone(value)
    }, [])

    const isNameError = !(debounceName.length >= 2 && debounceName.length <= MAX_NAME_LENGTH) && debounceName
    const isPhoneError = !isValidPhoneNumber(userPhone ? userPhone : '+7') && userStore.user?.phone !== debouncePhone && userPhone
    return (
        <Section >
            <div className={classes.settings}>
                <Loader
                    className={classes.settings__loader}
                    isLoading={userStore.isLoading || emailConfirmStore.isLoading || registrationStore.isLoading}
                />
                <div className={classes.settings__inner}>
                    <div className={classes.settings__content}>
                        <UserCropper
                            onImageSave={userImageHandler}
                            userIcon={userStore.user?.imageSrc || ''}
                            className={classes.settings__userCropper}
                        />
                        <div className={classes.settings__values}>
                            <SettingsRow
                                title='Ваше имя'
                                subtitle={'* от 2 до 80 символов'}
                                error={isNameError ? 'Ваше имя должно состоять от 2 до 80 символов' : ''}
                            >
                                <Input
                                    className={classConnection(
                                        classes.settings__input,
                                        isNameError ? classes.settings__input_error : '')}
                                    title='Ваше имя'
                                    value={userName}
                                    onChange={userNameHandler}
                                    name='username'
                                    type='text'
                                    placeholder={userStore.user?.email}
                                />
                            </SettingsRow>
                            <SettingsRow
                                title='Номер телефона'
                                subtitle={'* Это необязательно, но так вас легче найти мастеру'}
                                error={isPhoneError ? 'Номер телефона некорректный' : ''}
                            >
                                <PhoneInput
                                    className={classConnection(
                                        classes.settings__input,
                                        isPhoneError ? classes.settings__input_error : '')}
                                    value={userPhone}
                                    country="RU"
                                    international
                                    withCountryCallingCode
                                    onChange={userPhoneHandler}
                                    placeholder="Введите номер телефона"
                                />
                            </SettingsRow>
                            <SettingsEmailInput
                                inputClassName={classes.settings__input}
                                emailFieldClassName={classes.settings__inputRow}
                                email={userStore.user?.email || ''}
                            />
                        </div>
                    </div>
                    <SettingsFooter />
                </div>
            </div>

        </Section>
    )
})
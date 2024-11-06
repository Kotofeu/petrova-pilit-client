import { memo, FC, useState, useCallback, ChangeEvent, useEffect, useMemo } from 'react'
import Input from '../../UI/Input/Input';
import useDebounce from '../../utils/hooks/useDebounce';
import { classConnection } from '../../utils/function';

import classes from './NewPassword.module.scss'
import { AnimatePresence, motion } from 'framer-motion';
import PasswordShowButton from './PasswordShowButton';
interface INewPassword {
    className?: string;
    setNewPassword: (password: string) => void;
}

const EIGHT_CHARS_OR_GREATER = 'eightCharsOrGreater'
const UPPERCASE = 'uppercase'
const NUMBER = 'number'
const SPECIAL_CHAR = 'specialChar'
const SIXTEEN_CHARS_OR_GREATER = 'sixteenCharsOrGreater'

interface ValidParams {
    eightCharsOrGreater: boolean;
    uppercase: boolean;
    number: boolean;
    specialChar: boolean;
    sixteenCharsOrGreater: boolean;
}

const NewPassword: FC<INewPassword> = memo(({
    className,
    setNewPassword,
}) => {
    const defaultValid: ValidParams = {
        [EIGHT_CHARS_OR_GREATER]: false,
        [UPPERCASE]: false,
        [NUMBER]: false,
        [SPECIAL_CHAR]: false,
        [SIXTEEN_CHARS_OR_GREATER]: false,
    }
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setComPassword] = useState<string>('')

    const [error, setError] = useState<string>('')
    const [isShowPass, setIsShowPass] = useState<boolean>(false)
    const [validParm, setValidParm] = useState<ValidParams>(defaultValid);
    const [isMatch, setIsMatch] = useState<boolean>(false)

    const debouncePassword = useDebounce(password, 300)

    const isValidPassword = useCallback((password: string) => {
        let errorMessage = '';

        if (/[^a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\/|<>?]/.test(password)) {
            errorMessage = 'в пароле запрещенные символы';
        } else if (/\s/.test(password)) {
            errorMessage = 'в пароле содержатся пробелы';
        } else if (password.trim().length < 8) {
            errorMessage = '* не менее 8 символов';
        } else {
            setValidParm({
                eightCharsOrGreater: true,
                specialChar: /[!@#$%^&*()_+=[\]{};':"\\|/<>?]/.test(password),
                number: /\d/.test(password),
                uppercase: /[A-Z]/.test(password),
                sixteenCharsOrGreater: password.length >= 16
            })
        }
        if (errorMessage) {
            setValidParm(defaultValid)
        }
        setError(errorMessage)
    }, [])

    const onChangePassword = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }, [setPassword])
    const onChangeConfirmPassword = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setComPassword(event.target.value)
    }, [setComPassword])
    useEffect(() => {
        isValidPassword(debouncePassword)
    }, [debouncePassword, isValidPassword])
    useEffect(() => {
        if (validParm.eightCharsOrGreater && debouncePassword === confirmPassword) {
            {
                setIsMatch(true)
                setNewPassword(debouncePassword)
            }
        }
        else {
            setIsMatch(false)
            setNewPassword('')
        }
    }, [validParm, debouncePassword, confirmPassword])

    const sortedParams = useMemo(() => {
        return [
            { key: EIGHT_CHARS_OR_GREATER, label: '>8' },
            { key: UPPERCASE, label: 'A-Z' },
            { key: NUMBER, label: '1-9' },
            { key: SPECIAL_CHAR, label: '#' },
            { key: SIXTEEN_CHARS_OR_GREATER, label: '>16' },
        ].sort((a, b) => {
            return (validParm[a.key as keyof ValidParams] ? -1 : 1) - (validParm[b.key as keyof ValidParams] ? -1 : 1);
        });
    }, [validParm])
    return (
        <div className={classConnection(classes.newPassword, className)}>
            <div className={classes.newPassword__passBox}>
                <Input
                    className={classConnection(
                        classes.newPassword__password,
                        classes.newPassword__password_new,
                        (!!debouncePassword && !error && !confirmPassword) || isMatch ? classes.newPassword__password_match : '',
                        confirmPassword && !isMatch ? classes.newPassword__password_unMatch : ''
                    )
                    }
                    value={password}
                    onChange={onChangePassword}
                    type={isShowPass ? 'text' : 'password'}
                    placeholder='Новый пароль'
                    name='password'
                    title='Новый пароль'
                />
                <PasswordShowButton
                    className={classes.newPassword__showPass}
                    isShowPass={isShowPass}
                    setIsShowPass={setIsShowPass}
                />
            </div>
            <div className={classes.newPassword__passContent}>
                <AnimatePresence mode={'wait'} initial={false}>
                    {
                        (debouncePassword.length === 0 || error)
                        && <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: -0 }}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                            className={
                                classConnection(
                                    classes.newPassword__hint,
                                    debouncePassword.length !== 0 && error ? classes.newPassword__hint_error : ''
                                )
                            }
                            key={'hint'}
                        >
                            {debouncePassword.length !== 0 && error ? error : '* не менее 8 символов'}
                        </motion.span>
                    }
                    {
                        !!debouncePassword.length && !error &&
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                            className={classes.newPassword__valid}
                            key={'valid'}

                        >
                            <AnimatePresence>
                                {sortedParams.map(param => (
                                    <motion.div
                                        layout
                                        className={classConnection(
                                            classes.newPassword__validItem,
                                            validParm[param.key as keyof ValidParams] ? classes.newPassword__validItem_correct : ''
                                        )}
                                        key={param.label}
                                    >
                                        <span>{param.label}</span>

                                    </motion.div>
                                ))}
                            </AnimatePresence>

                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {
                    !isMatch &&
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: '0' }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '8px' }}
                        exit={{ opacity: 0, height: 0, marginTop: '0' }}
                    >
                        <Input
                            className={classConnection(
                                classes.newPassword__password,
                                confirmPassword ? classes.newPassword__password_unMatch : ''
                            )}
                            value={confirmPassword}
                            onChange={onChangeConfirmPassword}
                            type={isShowPass ? 'text' : 'password'}
                            placeholder='Повторите пароль'
                            name='confirm-password'
                            title='Повторите пароль'
                        />
                    </motion.div>
                }

            </AnimatePresence>

        </div>
    )
})

export default NewPassword
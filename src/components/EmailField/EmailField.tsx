import { memo, FC, useState, useCallback, ChangeEvent, useEffect } from 'react'
import Input from '../../UI/Input/Input'
import Button from '../../UI/Button/Button'
import { classConnection } from '../../utils/function';

import classes from './EmailField.module.scss'
import { useMessage } from '../../modules/MessageContext';


interface IEmailField {
    className?: string;
    inputClassName?: string;
    email?: string;
    onConfirm: (email: string) => void;
    onError?: (error: string) => void
}
const EmailField: FC<IEmailField> = memo(({
    className,
    inputClassName,
    email,
    onConfirm,
    onError
}) => {
    const [userEmail, setUserEmail] = useState<string>(email || '')
    const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const { addMessage } = useMessage();
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        return emailRegex.test(email);
    };
    const userEmailHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUserEmail(event.target.value)
    }, [email])
    useEffect(() => {
        setUserEmail(email || '')
    }, [email])
    useEffect(() => {
        setIsEmailEdit(userEmail !== email)
    }, [email, userEmail])
    const onConfirmClick = useCallback(() => {
        if (validateEmail(userEmail)) {
            onConfirm(userEmail)
            setIsError(false)
        }
        else {
            if (onError) onError('Неверный формат почты')
            setIsError(true)
            addMessage('Неверный формат почты', 'error')
        }
    }, [userEmail])
    return (
        <div className={classConnection(classes.emailField, className)}>
            <Input
                className={classConnection(
                    classes.emailField__input,
                    inputClassName,
                    isError ? classes.emailField__input_error : ""
                )}
                value={userEmail}
                onChange={userEmailHandler}
                name='email'
                type='text'
                title='Электронная почта'
                placeholder='Электронная почта'
            />
            {
                (isEmailEdit)
                &&
                <>
                    <Button
                        className={classes.emailField__confirmBtn}
                        type='button'
                        onClick={onConfirmClick}
                    >
                        Подтвердить
                    </Button>
                </>
            }
        </div>

    )
})

export default EmailField
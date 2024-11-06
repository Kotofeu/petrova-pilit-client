import { FC, memo, useState } from 'react'
import Input from '../../../../UI/Input/Input'
import PasswordShowButton from '../../../../components/NewPassword/PasswordShowButton'
import { classConnection } from '../../../../utils/function'
import classes from './AuthBlock.module.scss'

interface IAuthBlock {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void 
}

const AuthBlock: FC<IAuthBlock> = memo(({email, password, setEmail, setPassword}) => {
    const [isPassAuthShowing, setIsPassAuthShowing] = useState<boolean>(false)

    return (
        <>
            <Input
                className={classes.authInput}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                name='email'
                type='email'
                title='Электронная почта'
                placeholder='Электронная почта'

            />
            <div className={classes.authPass}>
                <Input
                    className={classConnection(
                        classes.authInput,
                        classes.authPass__input,

                    )}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={isPassAuthShowing ? 'text' : 'password'}
                    placeholder='Ваш пароль'
                    name='password'
                    title='Новый пароль'
                />
                <PasswordShowButton
                    className={classes.authPass__passShow}
                    isShowPass={isPassAuthShowing}
                    setIsShowPass={setIsPassAuthShowing}
                />
            </div>
        </>
    )
})

export default AuthBlock
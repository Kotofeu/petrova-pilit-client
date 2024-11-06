import { memo, FC } from 'react'
import Button from '../../UI/Button/Button'
import { classConnection } from '../../utils/function'
import classes from './NewPassword.module.scss'
interface IPasswordShowButton {
    className?: string;
    isShowPass: boolean;
    setIsShowPass: (value: React.SetStateAction<boolean>) => void;
}
const PasswordShowButton: FC<IPasswordShowButton> = memo(({
    className,
    isShowPass,
    setIsShowPass
}) => {
    return (
        <Button
            className={classConnection(
                classes.showPass,
                isShowPass ? classes.showPass_show : '',
                className
            )}
            onClick={() => setIsShowPass(prev => !prev)}
            title='Показать пароль'
        >
            <span></span>
        </Button>)
})

export default PasswordShowButton
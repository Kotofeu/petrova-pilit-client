import { memo, FC, ReactNode } from 'react'
import classes from './RegistrationBlock.module.scss'

interface IRegistrationBlock {
    isShowing?: boolean;
    title?: string;
    children: ReactNode;
}

export const RegistrationBlock: FC<IRegistrationBlock> = memo(({
    isShowing, title, children
}) => {
    if (!isShowing) return null
    return (
        <div className={classes.registrationBlock}>
            <h4
                className={classes.registrationBlock__title}
            >
                {title}
            </h4>
            {children}
        </div>
    )
})

import { memo, FC, ReactNode } from 'react'
import classes from './SettingsRow.module.scss'
import { classConnection } from '../../../../utils/function';

interface ISettingsInput {
    className?: string;
    title: string;
    subtitle?: string;
    children?: ReactNode;
    error?: string;
}

export const SettingsRow: FC<ISettingsInput> = memo(({
    className, title, subtitle, children, error
}) => {
    return (
        <div className={classConnection(classes.settingsRow, className)}>
            <h6 className={classes.settingsRow__title}>
                {title}
            </h6>
            {children}
            <span className={classConnection(
                classes.settingsRow__subtitle,
                error ? classes.settingsRow__subtitle_error : ''
            )}>
                {error || subtitle}
            </span>
        </div>)
})

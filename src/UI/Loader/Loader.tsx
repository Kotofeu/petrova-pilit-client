import { FC, memo } from 'react'
import classes from './Loader.module.scss'
import { classConnection } from '../../utils/function';

interface ILoader {
    className?: string;
    isLoading: boolean;
    style?: React.CSSProperties
}
const Loader: FC<ILoader> = memo(({ className, isLoading, style }) => {
    if (!isLoading) return null
    return (
        <div className={classConnection(classes.loader, className)} style={style}><div></div><div></div><div></div><div></div></div>
    )
})

export default Loader
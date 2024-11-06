import { FC, memo } from 'react'
import { motion } from 'framer-motion'
import classes from './ActiveLine.module.scss'
import { classConnection } from '../../utils/function';

interface IActiveLine {
    className?: string;
    layoutId: string;
    isActive: boolean;
}

const ActiveLine: FC<IActiveLine> = memo(({
    className,
    layoutId,
    isActive,
}) => {
    if (!isActive) return null
    return (
        <motion.div
            className={classConnection(
                classes.activeLine,
                className
            )}
            layoutId={layoutId}
            aria-hidden
        />
    )
})

export default ActiveLine
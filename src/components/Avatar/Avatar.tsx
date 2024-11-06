import { FC, memo } from 'react'
import { motion } from 'framer-motion'
import defaultAvatar from '../../assets/images/main.png'
import defaultBlob from '../../assets/images/blob.svg'
import defaultSplashes from '../../assets/images/splashes.png'
import classes from './Avatar.module.scss'
import { classConnection } from '../../utils/function'


interface IAvatar {
    className?: string;
    imageSrc?: string;
}
const HIDDEN = 'hidden'
const VISIBLE = 'visible'
const animateUp = {
    [HIDDEN]: {
        opacity: 0.6,
        y: 100
    },
    [VISIBLE]: {
        opacity: 1,
        y: 0
    }
}
const animateLeft = {
    [HIDDEN]: {
        opacity: 0,
        x: -100
    },
    [VISIBLE]: {
        opacity: 1,
        x: 0
    }
}
const animateRight = {
    [HIDDEN]: {
        opacity: 0,
        x: 100
    },
    [VISIBLE]: {
        opacity: 1,
        x: 0
    }
}
const Avatar: FC<IAvatar> = memo((props) => {
    const {
        className,
        imageSrc = defaultAvatar,
    } = props
    return (
        <motion.div
            className={classConnection(classes.avatar, className)}
            initial={HIDDEN}
            whileInView={VISIBLE}
            viewport={{ once: true, amount: 0.5 }}
        >
            <motion.img
                className={classes.avatar__image}
                variants={animateUp}
                transition={{ duration: 0.5 }}
                src={imageSrc}
                alt='Анастасия Петрова аватарка'
            />
            <motion.img
                className={classes.avatar__decoration}
                variants={animateLeft}
                transition={{ duration: 0.5 }}
                alt='Задний фон фигура'
                src={defaultBlob}

            />
            <motion.img
                className={classes.avatar__decoration}
                variants={animateRight}
                transition={{ duration: 0.5 }}
                src={defaultSplashes}
                alt='Задний фон рисунок'
            />
        </motion.div>
    )
})

export default Avatar
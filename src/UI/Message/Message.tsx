import { memo, FC } from 'react'
import { motion } from 'framer-motion'
import { classConnection } from '../../utils/function';

import classes from './Message.module.scss'
export type MessageType = 'error' | 'message' | 'complete'
interface IMessage {
    className?: string;
    type?: MessageType;
    text: string;
    onClose: () => void
}
const Message: FC<IMessage> = memo(({
    className,
    type = 'message',
    text,
    onClose
}) => {

    if (!text) return null
    return (

                <motion.div
                    animate={{ x: 0, opacity: 0.8 }}
                    exit={{ x: 100, opacity: 0 }}
                    initial={{ x: 100, opacity: 0 }}
                    className={classConnection(classes.message, className)}
                    onClick={onClose}
                    layout
                >
                    <p
                        className={classConnection(classes.message__text, classes[`message__text_${type}`])}

                    >
                        {text}
                    </p>

                </motion.div>

    )
})

export default Message
import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useEffect} from 'react'
import classes from './Modal.module.scss'
import { classConnection } from '../../utils/function';
interface IModal {
    className?: string;
    isOpen: boolean;
    children: ReactNode;
    closeModal: () => void;
}
const Modal: FC<IModal> = (props) => {
    const { className, isOpen, children, closeModal } = props
    useEffect(() => {
        document.body.style.overflowY = isOpen ? 'hidden' : 'auto';
    }, [isOpen])
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={classes.modal}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className={classConnection(classes.modal_inner, className)}
                    >
                        {children}

                    </motion.div>
                    <motion.button
                        className={classes.modal_close}
                        type='button'
                        onClick={closeModal}
                    />
                </motion.div >
            )}
        </AnimatePresence>
    )
}

export default Modal
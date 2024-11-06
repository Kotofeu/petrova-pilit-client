import { memo, FC, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import classes from './HeaderAsideModal.module.scss'
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton';
interface IHeaderAsideModal {
  isOpen: boolean;
  closeModal: (isOpen: boolean) => void;
  children?: ReactNode;
}

export const HeaderAsideModal: FC<IHeaderAsideModal> = memo(({ isOpen, closeModal, children }) => {
  return (
    <AnimatePresence>
      {
        isOpen
        && <motion.div
          className={classes.headerAsideModal}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: '100%' }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ power: 0.1 }}
        >
          <div className={classes.headerAsideModal__inner}>
            <ControllerButton
              className={classes.headerAsideModal__close}
              type='delete'
              title='Закрыть окно'
              onClick={() => closeModal(false)}
            />
            {
              children
            }
          </div>
        </motion.div>
      }

    </AnimatePresence>
  )
})
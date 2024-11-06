import { memo, FC } from 'react'
import Modal from './Modal';

import classes from './Modal.module.scss'
import Button from '../../UI/Button/Button';
import { classConnection } from '../../utils/function';

interface IModal {
    isOpen: boolean;
    onOkClick: () => void;
    closeModal: () => void;
}
const ModalOk: FC<IModal> = memo(({ isOpen, onOkClick, closeModal }) => {
    const okClickHandler = () => {
        document.body.style.overflowY = 'auto';
        closeModal();
        onOkClick();
    }
    return (
        <Modal
            isOpen={isOpen}
            closeModal={closeModal}
        >
            <div className={classes.modalBlock}>
                <h6 className={classes.modalBlock__title}>Вы уверены?</h6>
                <p className={classes.modalBlock__subtitle}>Ещё есть время передумать</p>
                <div className={classes.modalBlock__buttons}>
                    <Button
                        className={classes.modalBlock__button}
                        type='button'
                        title='Отмена'
                        onClick={closeModal}
                    >
                        Отмена
                    </Button>
                    <Button
                        className={
                            classConnection(classes.modalBlock__button, classes.modalBlock__button_ok)
                        }
                        type='button'
                        title='Ок'
                        onClick={okClickHandler}
                    >
                        Да!
                    </Button>
                </div>
            </div>
        </Modal>
    )
})

export default ModalOk

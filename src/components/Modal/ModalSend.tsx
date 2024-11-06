import { memo, FC, ReactNode, useCallback, FormEvent } from 'react'
import Modal from './Modal';
import Button from '../../UI/Button/Button';

import { classConnection } from '../../utils/function';

import classes from './Modal.module.scss'
interface IModalSend {
    className?: string;
    children?: ReactNode;
    isOpen: boolean;
    buttonText?: string;
    isButtonDisabled?: boolean
    closeModal: () => void;
    send?: () => void;
}
const ModalSend: FC<IModalSend> = memo(({
    className,
    children,
    isOpen,
    buttonText = 'Подтвердить',
    isButtonDisabled = false,
    closeModal,
    send
}) => {
    const onSendClick = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!isButtonDisabled && send) send()
    }, [isButtonDisabled, send])
    if (!children) return null
    return (
        <Modal
            isOpen={isOpen}
            closeModal={closeModal}
        >
            <div className={classConnection(classes.modalBlock, className)}>
                <form onSubmit={onSendClick}>
                    {children}
                    {
                        send
                            ? <Button
                                className={classes.modalBlock__confirm}
                                type='submit'
                                disabled={isButtonDisabled}
                            >
                                {buttonText}
                            </Button>
                            : null
                    }

                </form>
            </div>
        </Modal>)
})

export default ModalSend
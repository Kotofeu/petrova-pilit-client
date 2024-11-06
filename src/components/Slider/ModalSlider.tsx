import Modal from '../Modal/Modal'
import classes from './Slider.module.scss'
import { IBaseSlide, ISlider, Slider } from './Slider';

export interface IModalSlider<T extends IBaseSlide> extends ISlider<T> {
    isOpen: boolean;
    closeModal: () => void;
}
export const ModalSlider = <T extends IBaseSlide>(
    { isOpen, closeModal, ...sliderProps }: IModalSlider<T>
) => {
    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className={classes.sliderModal}>
                <Slider
                    className={classes.sliderModal__slider}
                    {...sliderProps}
                    customArrow={
                        <div className={classes.sliderModal__arrow}></div>
                    }
                />
            </div>
        </Modal>
    )
}

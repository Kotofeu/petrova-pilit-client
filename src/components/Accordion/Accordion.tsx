import { ReactNode, Dispatch } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import arrowImage from '../../assets/icons/Arrow.svg'

import classes from './Accordion.module.scss'
import { classConnection } from '../../utils/function';
interface IBaseSlide {
    id: string | number;
}
interface IAccordion<T extends IBaseSlide> {
    className?: string;
    listClassName?: string;
    items: T[];
    isMouseReact?: boolean;
    selectedItem: number | null;
    setSelectedItem: Dispatch<React.SetStateAction<number | null>>;
    renderTitle: (item: T, index: number) => ReactNode;
    renderDescription: (item: T, index: number) => ReactNode;
}
const Accordion = <T extends IBaseSlide>({
    className,
    items,
    selectedItem,
    isMouseReact = false,
    setSelectedItem,
    renderTitle,
    renderDescription
}: IAccordion<T>) => {
    const actionHandler = (index: number | null) => {
        setSelectedItem(index)
    }
    if (!items.length) return null
    return (
        <div
            className={[classes.accordion, className].join(' ')}
        >
            {
                items.map((item, index) => {
                    const isWithDescription: boolean = !!renderDescription(item, index)
                    return (
                        <div
                            key={item.id}
                            className={classes.accordion__item}
                            onMouseEnter={isMouseReact ? () => actionHandler(index) : undefined}
                            onMouseLeave={isMouseReact ? () => actionHandler(null) : undefined}
                        >
                            <div className={classes.accordion__title}>
                                {renderTitle(item, index)}
                                {
                                    isWithDescription
                                        ? <button
                                            className={classConnection(
                                                classes.accordion__openButton,
                                                selectedItem === index ? classes.accordion__openButton_active : ""
                                            )}
                                            onClick={() => actionHandler(selectedItem === index ? null : index)}
                                            type='button'>
                                            <img className={classes.accordion__arrow} src={arrowImage} alt='arrow'></img>
                                        </button> : null
                                }
                            </div>
                            <AnimatePresence initial={false}>
                                {
                                    (selectedItem === index && isWithDescription) &&
                                    <motion.div
                                        className={classes.accordion__description}
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { opacity: 1, height: "auto" },
                                            collapsed: { opacity: 0, height: 0 }
                                        }}
                                    >
                                        {renderDescription(item, index)}
                                    </motion.div>
                                }

                            </AnimatePresence>
                        </div>
                    )
                })
            }

        </div >
    )
}

export default Accordion
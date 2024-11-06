import { FC, useState, useCallback } from 'react'
import { motion } from 'framer-motion';
import Input from '../../../../UI/Input/Input';
import StarRating from '../../../../UI/StarRating/StarRating';
import Button from '../../../../UI/Button/Button';
import { COMMENT, MAX_NAME_LENGTH, MAX_COMMENT_LENGTH, NAME, RATING, IReviewForm } from './const';

import classes from './ReviewModal.module.scss'
import { classConnection } from '../../../../utils/function';
import { observer } from 'mobx-react-lite';
import { useMessage } from '../../../MessageContext';
import TextArea from '../../../../UI/TextArea/TextArea';
import { reviewsStore, userStore } from '../../../../store';


export const ReviewFormMain: FC<IReviewForm> = observer(({
    isUserAuth,
    isOpen,
    fromAction,
    formValues,
    setFormValues,
    onDeleteClick,
    startAuth,
    isUserAdmin
}) => {
    const [commentError, setCommentError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const { addMessage } = useMessage();
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (value.length > MAX_NAME_LENGTH) {
            return
        }
        setNameError(false)
        setFormValues(prev => ({ ...prev, [NAME]: value }));
    }, []);

    const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (value.length > MAX_COMMENT_LENGTH) {
            setCommentError(true)
            return
        }
        setCommentError(false)
        setFormValues(prev => ({ ...prev, [COMMENT]: value }));
    }, []);

    const handleRatingChange = useCallback((rating: number) => {
        setFormValues(prev => ({ ...prev, [RATING]: rating }));
    }, []);
    const onContinueClick = useCallback(() => {
        if (!isUserAuth || isUserAdmin) {
            if (formValues[NAME].length < 2) {
                setNameError(true)
                addMessage('Имя должно быть больше 2 символов', 'error')
                return
            }
            if (formValues[NAME].length > MAX_NAME_LENGTH) {
                setNameError(true)
                addMessage(`Имя должно быть меньше ${MAX_NAME_LENGTH} символов`, 'error')
                return
            }
        }
        if (formValues[RATING] === 0) {
            addMessage(`Укажите вашу оценку`, 'error')
            return
        }
        fromAction()
    }, [isUserAuth, formValues, isUserAdmin])
    if (!isOpen) return null
    return (

        <motion.div
            className={classes.modalContent}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
        >
            <h3 className={classes.modalContent__title}>Ваше честное мнение</h3>
            <div className={classes.modalContent__inner}>
                {!isUserAuth || isUserAdmin ? (
                    <div className={classes.modalContent__inputRow}>
                        <h6 className={classes.modalContent__label} style={{ alignSelf: 'center' }}>
                            {isUserAdmin ? 'Напишите имя клиента' : 'Как Вас зовут'}
                        </h6>
                        <div className={classes.modalContent__nameInputContainer}>
                            <Input
                                className={classConnection(
                                    classes.modalContent__nameInput,
                                    nameError ? classes.modalContent__nameInput_error : ''
                                )}
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleInputChange}
                            />
                            {
                                !isUserAdmin
                                && <div className={classes.modalContent__registerBox}>
                                    <span>или</span>
                                    <Button
                                        className={classes.modalContent__registerButton}
                                        onClick={startAuth}
                                    >
                                        Зарегистрируйтесь
                                    </Button>
                                </div>
                            }

                        </div>
                    </div>
                ) : null}

                <div className={classes.modalContent__inputRow}>
                    <h6 className={classes.modalContent__label} style={{ alignSelf: 'center' }}>
                        Ваша оценка
                    </h6>
                    <StarRating
                        className={classes.modalContent__rating}
                        name="rating"
                        rating={formValues.rating}
                        setRating={handleRatingChange}
                        starDimension="32px"
                    />
                </div>

                <div className={classes.modalContent__inputRow}>
                    <h6 className={classes.modalContent__label}>Комментарий</h6>
                    <div className={classes.modalContent__commentContainer}>
                        <TextArea
                            className={classes.modalContent__textArea}
                            name="comment"
                            value={formValues.comment}
                            onChange={handleCommentChange}
                            placeholder="Помогите другим людям узнать о моей работе подробнее"
                        />
                        <span
                            className={`${classes.modalContent__charCount} ${commentError ? classes.modalContent__charCount_error : ''}`}
                        >
                            {`${formValues.comment.length}/${MAX_COMMENT_LENGTH}`}
                        </span>
                    </div>
                </div>
                <div className={classConnection(
                    classes.modalContent__actionButtons,
                    onDeleteClick ? classes.modalContent__actionButtons_del : ''
                )}>
                    {
                        onDeleteClick
                            ? <Button
                                className={classes.modalContent__actionButton}
                                onClick={onDeleteClick}
                                disabled={userStore.isLoading || reviewsStore.isLoading}
                            >
                                Удалить
                            </Button>
                            : null
                    }
                    <Button
                        className={classes.modalContent__actionButton}
                        onClick={onContinueClick}
                        disabled={userStore.isLoading || reviewsStore.isLoading}
                    >
                        Далее
                    </Button>
                </div>

            </div>
        </motion.div>
    );
})
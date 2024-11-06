import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../../../UI/Button/Button';
import { DELETED_IDS, IMAGES, INITIAL_IMAGES, IReviewForm, NAME } from './const';
import classes from './ReviewModal.module.scss'
import PolicyAgree from '../../../../UI/PolicyAgree/PolicyAgree';
import MultipleFileInput from '../../../../components/MultipleFileInput/MultipleFileInput';
import { classConnection } from '../../../../utils/function';
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton';
import { IImages, reviewsStore, userStore } from '../../../../store';
import ServerImage from '../../../../UI/ServerImage/ServerImage';
import { observer } from 'mobx-react-lite';
const MAX_IMAGE_COUNT = 6
const MAX_IMAGES_WEIGHT = 10485760

export const ReviewFormImages: FC<IReviewForm> = observer(({
    isOpen,
    fromAction,
    formValues,
    onDeleteClick,
    setFormValues
}) => {
    const [uploaderImages, setUploadedImages] = useState<File[] | null>(formValues[IMAGES])
    const [initialImages, setInitialImages] = useState<IImages[]>(formValues[INITIAL_IMAGES])

    const generalWeight = useMemo(() => {
        if (!uploaderImages?.length) return 0
        return Math.round(uploaderImages.reduce((acc, curr) => acc + curr.size, 0) / 1024 / 1024 * 100) / 100
    }, [uploaderImages])

    const handleImagesDelete = useCallback((index: number) => {
        if (!uploaderImages || uploaderImages.length === 0) return;
        const updatedImagesArray = uploaderImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImagesArray);
    }, [uploaderImages, setUploadedImages]);

    const handleInitialImageDelete = useCallback((id: number) => {
        setFormValues(prev => ({
            ...prev,
            [DELETED_IDS]: [...prev[DELETED_IDS], id]
        }))
        setInitialImages(prev => prev.filter(image => image.id !== id))
    }, [setFormValues, setInitialImages])

    useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            [IMAGES]: uploaderImages || []
        }))
    }, [uploaderImages])

    useEffect(() => {
        if (formValues[INITIAL_IMAGES].length) {
            setInitialImages(formValues[INITIAL_IMAGES])
        }
    }, [formValues[INITIAL_IMAGES]])
    if (!isOpen) return null
    return (
        <motion.div
            className={classes.modalContent}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
        >
            <h3 className={classes.modalContent__title}>
                Добавьте фотографии, <br />
                <span>если есть и если хочется 😉</span>
            </h3>
            <div className={classes.modalContent__inner}>
                <div className={classConnection(classes.reviewImages)}>
                    <MultipleFileInput
                        className={classes.reviewImages__fileInput}
                        currentFiles={uploaderImages}
                        setFiles={setUploadedImages}
                        maxFilesCount={MAX_IMAGE_COUNT - initialImages.length}
                        maxTotalSize={MAX_IMAGES_WEIGHT - initialImages.length * 1024 * 1024}
                    />

                    <div className={classes.reviewImages__filesInfo}>
                        <span>
                            {
                                `${uploaderImages?.length
                                    ? uploaderImages?.length
                                    : 0
                                }/${MAX_IMAGE_COUNT - initialImages.length}`
                            }
                        </span>
                        <span>{`${generalWeight}Мб/${MAX_IMAGES_WEIGHT / 1024 / 1024 - initialImages.length}Мб`}</span>
                    </div>
                    <div className={
                        classConnection(
                            classes.reviewImages__images,
                            uploaderImages && uploaderImages.length > 3 ? classes.reviewImages__images_grid : ''
                        )
                    }
                    >
                        <AnimatePresence>
                            {
                                initialImages.length ? initialImages.map((image, index) => {
                                    if (!image.imageSrc) return null
                                    return (
                                        <motion.div
                                            className={classes.reviewImages__imageBox}
                                            key={image.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <ServerImage
                                                className={classes.reviewImages__background}
                                                src={image.imageSrc}
                                                alt={image.name || `${formValues[NAME]}: ${index + 1}`}
                                            />
                                            <ServerImage
                                                className={classes.reviewImages__image}
                                                src={image.imageSrc}
                                                alt={image.name || `${formValues[NAME]}: ${index + 1}`}
                                            />
                                            <ControllerButton
                                                className={classes.reviewImages__button}
                                                type='delete'
                                                onClick={() => handleInitialImageDelete(image.id)}
                                                title='Удалить фото'
                                            />
                                        </motion.div>
                                    )
                                })
                                    : null
                            }
                            {
                                uploaderImages?.length ? uploaderImages.map((image, index) => {
                                    return (
                                        <motion.div
                                            className={classes.reviewImages__imageBox}
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <img
                                                className={classes.reviewImages__background}
                                                src={URL.createObjectURL(image)}
                                                alt={image.name}
                                            />
                                            <img
                                                className={classes.reviewImages__image}
                                                src={URL.createObjectURL(image)}
                                                alt={image.name}
                                            />
                                            <ControllerButton
                                                className={classes.reviewImages__button}
                                                type='delete'
                                                onClick={() => handleImagesDelete(index)}
                                                title='Удалить фото'
                                            />
                                        </motion.div>
                                    )
                                })
                                    : null
                            }
                        </AnimatePresence>
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
                        onClick={fromAction}
                        disabled={userStore.isLoading || reviewsStore.isLoading}
                    >
                        Отправить
                    </Button>
                </div>

                <PolicyAgree
                    className={classes.modalContent__policy}
                    agreeWith={`Нажимая на кнопку "Отправить"`}
                />
            </div>
        </motion.div >
    );
})
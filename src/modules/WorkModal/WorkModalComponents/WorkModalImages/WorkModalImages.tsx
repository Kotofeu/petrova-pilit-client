import { FC, memo, useCallback, useEffect, useState } from 'react'
import MultipleFileInput from '../../../../components/MultipleFileInput/MultipleFileInput';
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton';
import { IImages } from '../../../../store';
import { classConnection } from '../../../../utils/function';

import classes from './WorkModalImages.module.scss';
import ImageCropperWithResult from '../../../../components/ImageCropper/ImageCropperWithResult';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

interface IWorkModalImages {
    className?: string;
    title?: string;
    initialAfter?: string | null;
    initialBefore?: string | null;
    initialOtherImages?: IImages[] | null;
    setAfter: (file: File | null) => void;
    setBefore: (file: File | null) => void;
    setOthers: (file: File[] | null) => void;
    setImagesToDelete: (images: React.SetStateAction<number[]>) => void
}

export const WorkModalImages: FC<IWorkModalImages> = memo(({
    className,
    title,
    initialAfter,
    initialBefore,
    initialOtherImages,
    setAfter,
    setBefore,
    setOthers,
    setImagesToDelete
}) => {
    const [otherImages, setOtherImages] = useState<File[] | null>(null)
    const [initialImages, setInitialImages] = useState(initialOtherImages ? initialOtherImages : [])
    useEffect(() => {
        setOthers(otherImages)
    }, [otherImages])

    const handleInitialImageDelete = useCallback((id: number) => {
        const deletedImage = initialImages.find(image => image.id === id)
        setImagesToDelete(prev => deletedImage?.id ? [...prev, deletedImage.id] : prev)
        setInitialImages(prev => prev.filter(image => image.id !== id))

    }, [initialImages, setInitialImages, setImagesToDelete])

    const handleImagesDelete = useCallback((index: number) => {
        if (!otherImages || otherImages.length === 0) return;
        const updatedImagesArray = otherImages.filter((_, i) => i !== index);
        setOtherImages(updatedImagesArray);
    }, [otherImages, setOtherImages]);

    return (
        <div className={classConnection(classes.workModalImages, className)}>
            <div className={classes.workModalImages__previews}>
                <ImageCropperWithResult
                    className={classes.workModalImages__previewBox}
                    title='Фото до'
                    name='beforeImage'
                    setImage={(file) => setBefore(file)}
                    initialImage={initialBefore ? `${process.env.REACT_APP_API_URL}/${initialBefore}` : ''}
                    aspect={4 / 3}
                />
                <ImageCropperWithResult
                    className={classes.workModalImages__previewBox}
                    title='Фото после'
                    name='afterImage'
                    setImage={(file) => setAfter(file)}
                    initialImage={initialAfter ? `${process.env.REACT_APP_API_URL}/${initialAfter}` : ''}
                    aspect={4 / 3}
                />
            </div>
            <div className={classes.workModalImages__othersPhotos}>
                <MultipleFileInput
                    className={classes.workModalImages__photosInput}
                    maxFilesCount={12 - initialImages?.length}
                    setFiles={(files) => setOtherImages(files)}
                    title='Другие фотографии'
                    currentFiles={otherImages}
                />
                <div className={classes.workModalImages__photosList}>
                    {
                        initialImages?.length ? initialImages.map((image) => {
                            return (
                                <div
                                    className={classes.workModalImages__photosItem}
                                    key={image.id}
                                >
                                    <ServerImage
                                        src={image.imageSrc || ''}
                                        alt={`Изображение ${image.id} к посту ${title}`}
                                    />
                                    <ControllerButton
                                        className={classes.workModalImages__photosDelete}
                                        type='delete'
                                        title={`Удалить фото ${image.id}`}
                                        onClick={() => handleInitialImageDelete(image.id)}
                                    />
                                </div>
                            )
                        }) : null
                    }
                    {
                        otherImages?.length ? otherImages.map((image, index) => {
                            return (
                                <div
                                    className={classes.workModalImages__photosItem}
                                    key={index}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Изображение №${index + 1} к посту ${title}`}
                                    />
                                    <ControllerButton
                                        className={classes.workModalImages__photosDelete}
                                        type='delete'
                                        title={`Удалить фото №${index + 1}`}
                                        onClick={() => handleImagesDelete(index)}
                                    />
                                </div>

                            )

                        }) : null
                    }
                </div>
            </div>
        </div>
    )
})

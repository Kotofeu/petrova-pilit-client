import { FC, memo, useCallback, useEffect, useState } from 'react'

import classes from './AdminImages.module.scss'
import { applicationStore, IImages } from '../../../../store'
import { useMessage } from '../../../MessageContext'
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton'
import MultipleFileInput from '../../../../components/MultipleFileInput/MultipleFileInput'
import ServerImage from '../../../../UI/ServerImage/ServerImage'

interface IAdminImages {
    images?: IImages[];
    addImage: (image: File[]) => Promise<void>;
    deleteImage: (id: number) => Promise<void>;
    title?: string;
    aspect?: number;
}
export const AdminImages: FC<IAdminImages> = memo(({
    images,
    addImage,
    deleteImage,
    title,
    aspect,
}) => {
    const { addMessage } = useMessage()
    const [files, setFiles] = useState<File[] | null>(null)


    const onDeleteImage = useCallback(async (id: number) => {
        await deleteImage(id)
        if (applicationStore.error) {
            addMessage(applicationStore.error, 'error')
        }
        else {
            addMessage('Изображение удалено', 'complete')
        }
    }, [deleteImage, applicationStore.error])

    const onAddImage = useCallback(async (images: File[]) => {
        await addImage(images)
        if (applicationStore.error) {
            addMessage(applicationStore.error, 'error')
        }
        else {
            addMessage('Изображение(ия) добавлено', 'complete')
        }
    }, [addImage, applicationStore.error])
    useEffect(() => {
        if (files) {
            onAddImage(files)
            setFiles(null)
        }
    }, [files])


    return (
        <div className={classes.adminImages}>
            <div
                className={classes.adminImages__addImage}
                style={{ aspectRatio: aspect || 1 }}
            >
                <MultipleFileInput
                    className={classes.adminImages__imageInput}
                    setFiles={setFiles}
                    currentFiles={files}
                    name={title}
                    title={title}
                    maxFileSize={7340032}
                />
            </div>
            {
                images?.length
                    ? images.map((image, index) => (
                        <div
                            className={classes.adminImages__imageBox}
                            key={image.id}
                            style={{ aspectRatio: aspect || 1 }}
                        >
                            <ServerImage
                                className={classes.adminImages__imageBackground}
                                src={image.imageSrc || ''}
                                alt={`Задний фот изображения №${index + 1}`}
                            />
                            <ServerImage
                                className={classes.adminImages__image}
                                src={image.imageSrc || ''}
                                alt={image.name || `Изображение №${index + 1}`}
                            />
                            <ControllerButton
                                className={classes.adminImages__deleteImage}
                                onClick={() => onDeleteImage(image.id)}
                                type='delete'
                            />
                            <span>{index + 1}</span>
                        </div>
                    ))
                    : null
            }
        </div>
    )
})

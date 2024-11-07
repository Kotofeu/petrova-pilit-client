import { memo, FC, useState, useCallback } from 'react'

import defaultUser from '../../../../assets/icons/User-icon.svg'
import FileInput from '../../../../components/FileInput/FileInput'
import Button from '../../../../UI/Button/Button'

import classes from './UserCropper.module.scss'
import { classConnection } from '../../../../utils/function'
import ImageCropper from '../../../../components/ImageCropper/ImageCropper'


interface IUserCropper {
    className?: string;
    userIcon?: string;
    onImageSave: (image: File | null) => void;
}
export const UserCropper: FC<IUserCropper> = memo(({
    className,
    onImageSave,
    userIcon
}) => {

    const [image, setImage] = useState<File | null>(null)
    const imageSave = useCallback((image: File | null) => {
        onImageSave(image)
        setImage(null)
    }, [image])
    const imageDelete = useCallback(() => {
        onImageSave(null)
    }, [image])
    return (
        <div className={classConnection(classes.userCropper, className)}>
            <div className={classes.userCropper__inner}>
                <div className={classes.userCropper__imageBox}>
                    {
                        image
                            ?
                            <ImageCropper
                                className={classes.userCropper__cropper}
                                image={URL.createObjectURL(image)}
                                aspect={1}
                                onClose={() => setImage(null)}
                                onSave={imageSave}
                                cropShape='round'
                            />
                            : <>
                                {
                                    userIcon
                                        ? <Button
                                            className={classes.userCropper__delete}
                                            type='button'
                                            onClick={imageDelete}
                                            title='Удалить текущее фото'>
                                            Удалить фото
                                        </Button>
                                        : null
                                }
                                <img
                                    className={classes.userCropper__image}
                                    src={userIcon ? `${process.env.REACT_APP_API_URL_FILE}/${userIcon}` : defaultUser}
                                    alt="User icon"
                                />
                            </>
                    }
                    {
                        !image
                            ? <FileInput
                                className={classes.userCropper__cropperInput}
                                handleFileChange={setImage}
                                title='Загрузить фото'
                            />
                            : null
                    }
                </div>
            </div>
        </div>
    )
})

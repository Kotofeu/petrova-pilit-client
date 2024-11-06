import { FC, memo, useCallback, useState } from 'react'
import { classConnection } from '../../utils/function';
import ControllerButton from '../../UI/ControllerButton/ControllerButton';
import ImageCropper from './ImageCropper';
import FileInput from '../FileInput/FileInput';

import classes from './ImageCropper.module.scss'

interface IImageCropperWithResult {
  className?: string;
  setImage: (file: File | null) => void;
  initialImage?: string;
  title?: string;
  name?: string;
  aspect?: number
  addCloseButton?: boolean;
  addScale?: boolean;
  addRotate?: boolean;
}

const ImageCropperWithResult: FC<IImageCropperWithResult> = memo(({
  className,
  setImage,
  initialImage,
  title,
  name,
  aspect = 1,
  addCloseButton = true,
  addScale = true,
  addRotate = true,
}) => {
  const [loadedFile, setLoadedFile] = useState<File>()
  const [croppedFile, setCroppedFile] = useState<string>(initialImage || '')

  const loadImage = useCallback((file: File | null) => {
      setLoadedFile(file || undefined)
      setCroppedFile(file? '' : initialImage || '')
  }, [setLoadedFile])

  const cropImage = useCallback((file: File | null) => {
      setImage(file)
      setCroppedFile(file ? URL.createObjectURL(file) : initialImage || '')
      setLoadedFile(undefined)
  }, [setImage, setLoadedFile, setCroppedFile])

  const onCloseCrop = useCallback(() => {
      setLoadedFile(undefined)
      setImage(null)
      setCroppedFile(initialImage || '')
  }, [setLoadedFile, setCroppedFile])

  return (
      <div className={classConnection(classes.imageCropperWithResult, className)}>
          {
              croppedFile
                  ? <img src={croppedFile} alt={title} />
                  : null
          }
          {
              croppedFile && addCloseButton && croppedFile !== initialImage
                  ? <ControllerButton
                      className={classes.imageCropperWithResult__delete}
                      type='delete'
                      title='Удалить фото'
                      onClick={() => cropImage(null)}
                  />
                  : null
          }
          {
              loadedFile && !croppedFile
                  ? <ImageCropper
                      className={classes.imageCropperWithResult__cropper}
                      image={URL.createObjectURL(loadedFile)}
                      onSave={cropImage}
                      aspect={aspect}
                      onClose={onCloseCrop}
                      addRotate = {addRotate}
                      addScale = {addScale}
                  />
                  : null
          }
          {
              !loadedFile
                  ? <FileInput
                      className={classes.imageCropperWithResult__preview}
                      handleFileChange={loadImage}
                      name={name}
                      title={title}
                  />
                  : null
          }
      </div>
  )
})
export default ImageCropperWithResult
import React, { memo, useState } from 'react';
import classes from './FileInput.module.scss';
import { classConnection } from '../../utils/function';
import { useMessage } from '../../modules/MessageContext';
import heic2any from 'heic2any';
import Loader from '../../UI/Loader/Loader';


interface IFileInput {
    className?: string;
    title?: string;
    handleFileChange: (images: File | null) => void
    maxFileSize?: number;
    name?: string;
    type?: 'photo' | 'icon' | 'video'
}

const FileInput: React.FC<IFileInput> = memo(({
    className = '',
    title = 'Выбрать файл',
    handleFileChange,
    maxFileSize = 4194304,
    name,
    type = 'photo',
}) => {
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const allowedExtensions = type === 'photo'
        ? /.(jpg|jpeg|png|gif|webp|bmp|heic|heif)$/i
        : type === 'icon'
            ? /.(svg|png)$/i
            : /.(mp4|mov)$/i;
    const { addMessage } = useMessage();
    const validateFile = (file: File) => {
        if (file.size > maxFileSize) {
            addMessage(`Превышен максимальный размер (${maxFileSize / 1024 / 1024}Мб) файла: "${file.name}" (${Math.round(file.size / 1024 / 1024 * 100) / 100}Мб.)`, 'error')
            setIsError(true);
            handleFileChange(null);
            return false;
        }
        if (!allowedExtensions.exec(file.name)) {
            addMessage(`Неподдерживаемый формат файла ${file.name}`, 'error')
            setIsError(true);
            handleFileChange(null);
            return false;
        }
        return true;
    };

    const convertHeicToJpg = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            heic2any({ blob: file, toType: 'image/jpeg' })
                .then((blobs) => {
                    const blob = Array.isArray(blobs) ? blobs[0] : blobs;
                    const jpgFile = new File([blob], file.name.replace(/..+$/, '.jpg'), { type: 'image/jpeg' });
                    resolve(jpgFile);
                })
                .catch(reject);
        });
    };
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        fileLoad(event.target.files ? event.target.files[0] : null)

    };
    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsHovering(false);
        fileLoad(event.dataTransfer.files ? event.dataTransfer.files[0] : null)
    };
    const fileLoad = async (file: File | null) => {
        setIsLoading(true)
        setIsError(false);
        if (file) {
            if (validateFile(file)) {
                if (/.(heic|heif)$/i.exec(file.name)) {
                    addMessage(`Конвертация фотографии типа heic`, 'message')
                    try {
                        const jpgFile = await convertHeicToJpg(file);
                        handleFileChange(jpgFile);
                        setIsError(false);
                    } catch (error) {
                        setIsError(true);
                        addMessage(`Ошибка конвертации heic файла: ${error}`, 'error')
                    }
                }
                else {
                    handleFileChange(file);
                }
            }
        }
        setIsLoading(false)

    }
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = () => {
        setIsHovering(false);
    };

    return (
        <>
            <label
                className={classConnection(
                    classes.fileInput,
                    isError ? classes.fileInput_error : '',
                    isHovering ? classes.fileInput_hover : '',
                    className
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {
                    !isLoading
                        ? <span className={classes.fileInput__text}>
                            {title}
                        </span>
                        : null
                }
                {
                    isLoading && !isError
                        ? <Loader className={classes.fileInput__loader} isLoading />
                        : null
                }
                <input
                    name={name}
                    type="file"
                    accept={
                        type === 'photo' ? '.jpg,.jpeg,.png,.gif,.bmp,.heic,.webp,.heif' :
                            type === 'icon' ? '.svg,.png' : '.mp4,.mov'
                    }
                    onChange={handleInputChange}
                    onClick={(event) => event.currentTarget.value = ''}
                    style={{ display: 'none' }}
                />
            </label>
        </>
    );
});

export default FileInput;
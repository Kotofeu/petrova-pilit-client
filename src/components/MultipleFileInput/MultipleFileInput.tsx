import React, { memo, useMemo, useState } from 'react';
import classes from './MultipleFileInput.module.scss';
import { classConnection } from '../../utils/function';
import { useMessage } from '../../modules/MessageContext';
import heic2any from 'heic2any';
import Loader from '../../UI/Loader/Loader';

interface IMultipleFileInput {
    className?: string;
    title?: string;
    currentFiles: File[] | null;
    setFiles: (images: React.SetStateAction<File[] | null>) => void
    maxFileSize?: number;
    maxTotalSize?: number;
    maxFilesCount?: number;
    name?: string;
}

const MultipleFileInput: React.FC<IMultipleFileInput> = memo(({
    className = '',
    title = 'Выбрать файлы',
    currentFiles,
    setFiles,
    maxTotalSize = 10485760,
    maxFileSize = maxTotalSize,
    maxFilesCount = 10,
    name,
}) => {
    const [isError, setIsError] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const allowedExtensions = /.(jpg|jpeg|png|gif|webp|bmp|heic|heif)$/i;
    const { addMessage } = useMessage();

    const currentFilesSize = useMemo(() => (
        currentFiles ? Array.from(currentFiles).reduce((acc, curr) => acc + curr.size, 0) : 0
    ), [currentFiles]);

    const currentFilesCount = useMemo(() => (
        currentFiles ? currentFiles.length : 0
    ), [currentFiles]);

    const validateFiles = (newFiles: File[]) => {
        for (const file of newFiles) {
            if (file.size > maxFileSize) {
                addMessage(`Превышен размер файла ${file.name}. Максимальный размер: ${maxFileSize / 1024 / 1024} Мб`, 'error');
                setIsError(true);
                return false;
            }
            if (!allowedExtensions.test(file.name)) {
                addMessage(`Неподдерживаемый формат файла ${file.name}`, 'error');
                setIsError(true);
                return false;
            }
        }
        return true;
    };

    const convertHeicToJpg = async (fileList: File[]): Promise<File[]> => {
        let isConverting: boolean = true
        const promises = fileList.map(async (file) => {
            if (/.heic$|.heif$/i.test(file.name)) {
                if (isConverting) {
                    addMessage('Конвертация фотографии типа HEIC', 'message');
                    isConverting = false
                }
                const blobs = await heic2any({ blob: file, toType: 'image/jpeg' });
                const blob = Array.isArray(blobs) ? blobs[0] : blobs;
                return new File([blob], file.name.replace(/.heic$|.heif$/i, '.jpg'), { type: 'image/jpeg' });
            }
            return file;
        });
        return Promise.all(promises);
    };

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isLoading) {
            await handleFileUpload(event.target.files);
        }
    };

    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsHovering(false);
        if (!isLoading) {
            await handleFileUpload(event.dataTransfer.files);
        }
    };

    const handleFileUpload = async (uploadedFiles: FileList | null) => {
        setIsLoading(true);
        setIsError(false);

        if (uploadedFiles) {
            let filesArray = Array.from(uploadedFiles);
            const uploadedFilesSize = filesArray.reduce((acc, file) => acc + file.size, 0);

            if (uploadedFilesSize + currentFilesSize > maxTotalSize) {
                addMessage(`Превышен максимальный общий размер файлов: ${maxTotalSize / 1024 / 1024} Мб`, 'error');
                setIsError(true);
                setIsLoading(false);
                return;
            }

            if (filesArray.length + currentFilesCount > maxFilesCount) {
                addMessage(`Превышено максимальное количество файлов: ${maxFilesCount} шт.`, 'error');
                filesArray = filesArray.slice(0, maxFilesCount - currentFilesCount);
            }

            if (validateFiles(filesArray)) {
                try {
                    const convertedJpgFiles = await convertHeicToJpg(filesArray);
                    setFiles(prevFiles => [...(prevFiles || []), ...convertedJpgFiles]);
                    setIsError(false);
                } catch (error) {
                    setIsError(true);
                    addMessage(`Ошибка конвертации HEIC файла: ${error}`, 'error');
                }
            }
        }

        setIsLoading(false);
    };

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
                    classes.multipleFileInput,
                    isError ? classes.multipleFileInput_error : '',
                    isHovering && !isLoading ? classes.multipleFileInput_hover : '',
                    isLoading ? classes.multipleFileInput_dis: '',
                    className
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {
                    !isLoading
                        ? <span className={classes.multipleFileInput__cam} />
                        : null
                }
                {
                    isLoading && !isError
                        ? <Loader className={classes.multipleFileInput__loader} isLoading />
                        : null
                }

                <span className={classes.multipleFileInput__text}>
                    {title}
                </span>
                <input
                    name={name}
                    type="file"
                    multiple={maxFilesCount > 1}
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.heic,.webp,.heif"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                    onClick={(event) => event.currentTarget.value = ''}
                    disabled={isLoading}
                />
            </label>
        </>
    );
});

export default MultipleFileInput;
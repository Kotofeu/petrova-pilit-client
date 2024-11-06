import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';
import Button from '../../UI/Button/Button';
import classes from './ImageCropper.module.scss'
import { classConnection } from '../../utils/function';
import { RotateControls } from './RotateControls';
import { ZoomControls } from './ZoomControls';
import { useMessage } from '../../modules/MessageContext';
interface CropperProps {
    className?: string;
    image: string;
    onSave: (image: File | null) => void;
    onClose: () => void
    aspect: number;
    cropShape?: "round" | "rect" | undefined;
    addRotate?: boolean;
    addScale?: boolean;
}

const ImageCropper: React.FC<CropperProps> = ({
    className,
    image,
    onSave,
    aspect,
    onClose,
    cropShape = 'rect',
    addRotate = true,
    addScale = true
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const cropperRef = useRef<Cropper | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const {addMessage} = useMessage()
    const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
                onSave(croppedImage);
            }
            catch {
                addMessage('Произошла непредвиденная ошибка', 'error')
            }

        }
    };

    return (
        <div className={classConnection(classes.imageCropper, className)}>
            <Cropper
                classes={{
                    containerClassName: classConnection(
                        classes.imageCropper__container,
                        addRotate && addScale ? classes.imageCropper__container_margin : '',
                        addScale ? classes.imageCropper__container_marginH : '',
                        addRotate ? classes.imageCropper__container_marginV : '',

                    )
                }}
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={(rotate) => setRotation(rotate <= 180 && rotate >= -180 ? rotate : rotation)}
                onCropComplete={handleCropComplete}
                ref={cropperRef}
                zoomWithScroll={true}
                showGrid={true}
                cropShape={cropShape}
            />
            {
                addRotate &&
                <RotateControls
                    rotation={rotation}
                    setRotation={setRotation}
                />
            }
            {
                addScale &&
                <ZoomControls
                    zoom={zoom}
                    setZoom={setZoom}
                />
            }
            <div
                className={classes.imageCropper__buttonsBox}
            >
                <Button
                    className={classes.imageCropper__button}
                    type='button'
                    onClick={onClose}
                    title='Отмена'>
                    Отмена
                </Button>
                <Button
                    className={classes.imageCropper__button}
                    type='button'
                    onClick={handleSave}
                    title='Добавить'>
                    Добавить
                </Button>
            </div>

        </div>
    );
};

export default ImageCropper;
import React, { memo, FC, useCallback } from 'react';
import classes from './ImageCropper.module.scss';
import Button from '../../UI/Button/Button';

interface IZoomControls {
    zoom: number;
    setZoom: (rotation: React.SetStateAction<number>) => void;
}

export const ZoomControls: FC<IZoomControls> = memo(({ zoom, setZoom }) => {
    const zoomHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setZoom(Number(event.target.value))
    }, [setZoom])
    return (
        <div className={classes.zoom}>
            <Button
                className={classes.inputButton}
                onClick={() => setZoom(prev => prev < 3 ? prev + 0.25 : 3)}
                title='Увеличить изображение'
            >
                <span className={classes.inputButton_plus} />
            </Button>

            <input
                className={classes.cropControl}
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={zoomHandler}
            />
            <Button
                className={classes.inputButton}
                onClick={() => setZoom(prev => prev > 1 ? prev - 0.25 : 1)}
                title='Уменьшить изображение'
            >
                <span className={classes.inputButton_minus} />
            </Button>
        </div>
    )
})
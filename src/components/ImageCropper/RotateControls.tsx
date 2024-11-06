import React, { memo, FC, useCallback } from 'react';
import classes from './ImageCropper.module.scss';
import circleArrow from '../../assets/icons/circular_arrow_line.svg';
import Button from '../../UI/Button/Button';

interface IRotateControls {
    rotation: number;
    setRotation: (rotation: React.SetStateAction<number>) => void;
}

export const RotateControls: FC<IRotateControls> = memo(({ rotation, setRotation }) => {
    const rotationHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRotation(Number(event.target.value))
    }, [setRotation])
    return (
        <div className={classes.rotation}>
            <Button
                className={classes.inputButton}
                onClick={() => setRotation(prev => prev > -160 ? prev - 20 : -180)}
                title='Повернуть влево'
            >
                <img
                    className={classes.inputButton__rotateIcon}
                    src={circleArrow} alt="Left" aria-hidden
                />
            </Button>
            <input
                className={classes.cropControl}
                id="rotate"
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotation}
                onChange={rotationHandler}
            />
            <Button
                className={classes.inputButton}
                onClick={() => setRotation(prev => prev < 160 ? prev + 20 : 180)}
                title='Повернуть вправо'
            >
                <img
                    className={classes.inputButton__rotateIcon_flip}
                    src={circleArrow} alt="Right" aria-hidden
                />
            </Button>
            <Button
                className={classes.inputButton__rotateIcon_center}
                onClick={() => setRotation(0)}
                title='Выравнять по центру'
            />
        </div>
    );
});
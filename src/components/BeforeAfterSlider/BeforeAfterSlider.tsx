import React, { useState, useEffect, useRef, useCallback } from "react";
import compare from './compare.svg'
import classes from './BeforeAfterSlider.module.scss';
import { classConnection } from "../../utils/function";

interface IBeforeAfterSlider {
    className?: string;
    before: string;
    after: string;
}

const BeforeAfterSlider: React.FC<IBeforeAfterSlider> = ({
    className,
    before,
    after
}) => {
    const [isResizing, setIsResizing] = useState(false);
    const topImageRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const setPositioning = useCallback((x: number) => {

        if (topImageRef.current && handleRef.current) {
            const { left, width } = topImageRef.current.getBoundingClientRect();
            const handleWidth = handleRef.current.offsetWidth;
            if (x >= left && x <= width + left - handleWidth) {
                handleRef.current.style.left = `${((x - left) / width) * 100}%`;
                topImageRef.current.style.clipPath = `inset(0 ${100 - ((x - left) / width) * 100}% 0 0)`;
            }
        }
    }, []);

    const handleResize = useCallback((e: MouseEvent | TouchEvent) => {
        if ('clientX' in e) {
            setPositioning(e.clientX);
        } else if (e.touches[0] && e.touches[0].clientX) {
            setPositioning(e.touches[0].clientX);
        }
    }, [setPositioning]);

    useEffect(() => {
        if (topImageRef.current && handleRef.current) {
            const { left, width } = topImageRef.current.getBoundingClientRect();
            const handleWidth = handleRef.current.offsetWidth;

            setPositioning(width / 2 + left - handleWidth / 2);
        }
    }, [setPositioning]);

    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);

        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("touchmove", handleResize);
        window.removeEventListener("mouseup", handleResizeEnd);
        window.removeEventListener("touchend", handleResizeEnd);
    }, [handleResize]);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (handleRef.current) {
            const handleElement = handleRef.current as HTMLDivElement;
            const { offsetLeft, offsetParent } = handleElement;

            if (e.code === "ArrowLeft") {
                setPositioning(offsetLeft + (offsetParent as HTMLElement).offsetLeft - 10);
            }

            if (e.code === "ArrowRight") {
                setPositioning(offsetLeft + (offsetParent as HTMLElement).offsetLeft + 10);
            }
        }
    }, [setPositioning]);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);
    const handleContainerClick = (e: React.MouseEvent) => {
        const { clientX } = e;
        setPositioning(clientX);
    };
    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleResize);
            window.addEventListener("touchmove", handleResize);
            window.addEventListener("mouseup", handleResizeEnd);
            window.addEventListener("touchend", handleResizeEnd);
        }


        return () => {
            window.removeEventListener("mousemove", handleResize);
            window.removeEventListener("touchmove", handleResize);
            window.removeEventListener("mouseup", handleResizeEnd);
            window.removeEventListener("touchend", handleResizeEnd);
        };
    }, [isResizing, handleResize, handleResizeEnd]);
    return (
        <>
            <div className={classConnection(classes.slider, className)} onClick={handleContainerClick}>
                <div
                    ref={handleRef}
                    className={classes.slider__handle}
                    onMouseDown={() => setIsResizing(true)}
                    onTouchStart={() => setIsResizing(true)}
                >
                    <span className={classes.slider__handleBtn}>
                        <img src={compare} alt="compare icon" />
                    </span>

                </div>
                <div
                    ref={topImageRef}
                    className={
                        classConnection(classes.slider__comparisonItem, classes.slider__top)
                    }
                >
                    <span>ДО</span>
                    <img draggable="false" src={before} alt='До' />
                </div>
                <div className={classes.slider__comparisonItem}>
                    <span>ПОСЛЕ</span>
                    <img draggable="false" src={after} alt='После' />
                </div>
            </div>
        </>
    );
};

export default BeforeAfterSlider;

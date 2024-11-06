import { useEffect, useState, useCallback } from 'react';



function useCountDown(initial: number, isAutoPlay: boolean = false): [number, () => void, (time?: number) => void] {
    const [countdown, setCountdown] = useState<number>(initial);
    const [isActive, setIsActive] = useState<boolean>(isAutoPlay);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, countdown]);

    const stopCountDown = useCallback(() => {
        setIsActive(false);
        setCountdown(0);
    }, []);


    const resetCountDown = useCallback((time?: number) => {
        console.log(isActive)

        setCountdown(time || initial);
        setIsActive(true)
    }, [initial]);

    return [countdown, stopCountDown, resetCountDown];
}

export default useCountDown;
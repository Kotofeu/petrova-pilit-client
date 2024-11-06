import { FC, memo, useMemo } from 'react'
import Clock from '../../../../assets/icons/clock.svg'
import classes from './ServicesTitle.module.scss'
import { classConnection } from '../../../../utils/function';
interface IServicesTitle {
    className?: string;
    name: string;
    price: number;
    time: number;
}
export const ServicesTitle: FC<IServicesTitle> = memo(({
    className,
    name,
    price,
    time,
}) => {
    const timeToString = useMemo(() => {
        const hours = Math.floor(time / 60);
        const remainingMinutes = time % 60;

        const hourWord =
            hours % 10 === 1 && hours % 100 !== 11 ? 'час' :
                (2 <= hours % 10 && hours % 10 <= 4 && !(12 <= hours % 100 && hours % 100 <= 14)) ? 'часа' :
                    'часов';

        const minuteWord =
            remainingMinutes % 10 === 1 && remainingMinutes % 100 !== 11 ? 'минута' :
                (2 <= remainingMinutes % 10 && remainingMinutes % 10 <= 4 && !(12 <= remainingMinutes % 100 && remainingMinutes % 100 <= 14)) ? 'минуты' :
                    'минут';
        const result: string[] = [];
        if (hours > 0) {
            result.push(`${hours} ${hourWord}`);
        }
        if (remainingMinutes > 0) {
            result.push(`${remainingMinutes} ${minuteWord}`);
        }
        return result.length > 0 ? result.join(' ') : 'Время не указано';
    }, [time])


    return (
        <div className={classConnection(classes.service, className)}>
            <div className={classes.service__infoBox}>
                <h5 className={classes.service__title}>{name}</h5>
                <p
                    className={classConnection(classes.service__price, !price ? classes.service__price_free : '')}
                >
                    {price ? `от ${price} руб.` : 'Бесплатно'}
                </p>
            </div>
            <p className={classes.service__time}>
                <img src={Clock} alt='Clock icon' className={classes.service__clock} />
                <span>{timeToString}</span>
            </p>

        </div>)
})
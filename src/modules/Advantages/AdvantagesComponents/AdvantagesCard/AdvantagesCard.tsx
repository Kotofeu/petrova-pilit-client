import { FC, memo } from 'react'

import classes from './AdvantagesCard.module.scss'
import { classConnection } from '../../../../utils/function';
import ServerImage from '../../../../UI/ServerImage/ServerImage';
interface IAdvantagesCard {
    className?: string;
    title?: string | null;
    description?: string | null;
    imageSrc?: string | null;
}
export const AdvantagesCard: FC<IAdvantagesCard> = memo(({
    className,
    title,
    description,
    imageSrc
}) => {
    if (!title || !description || !imageSrc) return null
    return (
        <div className={classConnection(classes.advantagesCard, className)} >
            <div className={classes.advantagesCard__imageBox}>
                <ServerImage className={classes.advantagesCard__image} src={imageSrc} alt={title} />
            </div>
            <h4 className={classes.advantagesCard__title} >{title}</h4>
            <p className={classes.advantagesCard__description} >{description}</p>
        </div>
    )
})

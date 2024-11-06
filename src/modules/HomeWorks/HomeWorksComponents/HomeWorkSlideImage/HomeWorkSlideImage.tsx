import { FC, memo } from 'react'
import classes from './HomeWorkSlideImage.module.scss'
import { classConnection } from '../../../../utils/function';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

interface IHomeWorkSlideImage {
    className?: string
    imageSrc?: string | null;
    alt?: string;
    type?: 'after' | 'before'
}

export const HomeWorkSlideImage: FC<IHomeWorkSlideImage> = memo((props) => {
    if (!props.imageSrc) return null
    return (
        <div
            className={classConnection(
                classes.slideImageBox,
                props.type ? classes[`slideImageBox_${props.type}`] : '',
                props.className
            )}>
            <ServerImage
                className={classes.slideImageBox__image}
                src={props.imageSrc}
                alt={props.alt || props.type || props.imageSrc} />
        </div>
    )
})

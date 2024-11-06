import { FC, memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classes from './WorkCard.module.scss';
import { WORKS_ROUTE } from '../../../../utils/const/routes';
import Button from '../../../../UI/Button/Button';
import DateTime from '../../../../UI/DateTime/DateTime';
import { classConnection } from '../../../../utils/function';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

interface IWorkCard {
    id: number;
    className?: string;
    image?: string | null;
    title?: string | null;
    date?: number | null;
}

const WorkCard: FC<IWorkCard> = memo(({ id, className, title, image, date }) => {
    const router = useNavigate();
    const [isShowMore, setIsShowMore] = useState<boolean>(false)

    const onCardClick = useCallback(() => {
        router(`${WORKS_ROUTE}/${id}`);
    }, [id, router]);

    if (!image || !title) return null;

    return (
        <motion.article
            className={classConnection(classes.workCard, isShowMore ? classes.workCard_active : '', className)}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <ServerImage className={classes.workCard__image} src={image} alt={title} />
            <h4 className={classes.workCard__title}>{title}</h4>
            {
                date
                    ? <DateTime className={classes.workCard__date} date={date} addTime />
                    : null
            }
            <Button onClick={onCardClick} className={classes.workCard__button}>ПОДРОБНЕЕ</Button>
            <Button onClick={() => setIsShowMore(prev => !prev)} className={classes.workCard__show} />
        </motion.article>
    );
});

export default WorkCard;
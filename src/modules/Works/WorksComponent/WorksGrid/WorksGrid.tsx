import { memo, FC, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classes from './WorksGrid.module.scss';
import WorkCard from '../WorkCard/WorkCard';
import { classConnection } from '../../../../utils/function';
import { IWork } from '../../../../store';

interface IWorksGrid {
    className?: string;
    works: IWork[];
    isLoading?: boolean
}

export const WorksGrid: FC<IWorksGrid> = memo(({ className, works, isLoading }) => {
    const emptyCeil: IWork = { id: -1, name: '', createdAt: 0 }
    const workWithEmptyCeils = useMemo(() => {
        let emptyCeils = 0
        const worksArray = [...works]
        if (isLoading) {
            emptyCeils = 4
        }
        else if (worksArray.length < 4) {
            emptyCeils = 4 - worksArray.length;
        } else if (worksArray.length > 4 && worksArray.length % 2 !== 0) {
            emptyCeils = 1;
        } else {
            emptyCeils = 0;
        }
        for (let i = 0; i < emptyCeils; i++) {
            worksArray.push(emptyCeil);
        }
        return worksArray
    }, [works])
    if (!works.length && !isLoading) return null
    return (
        <motion.div
            className={classConnection(classes.grid, className)}
        >
            {workWithEmptyCeils.map((work, index) => {
                if (work.id === -1 || isLoading) {
                    return (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={classConnection(classes.grid__card, classes.grid__card_empty, isLoading ? 'loading' : '')}
                            key={0 - (index + 1)}
                        />
                    )
                }
                return (
                    <WorkCard
                        className={classes.grid__card}
                        key={work.id}
                        id={work.id}
                        image={work.imageBeforeSrc || work.imageAfterSrc}
                        title={work.name}
                        date={work.createdAt}
                    />
                )
            })}
        </motion.div>
    );
});
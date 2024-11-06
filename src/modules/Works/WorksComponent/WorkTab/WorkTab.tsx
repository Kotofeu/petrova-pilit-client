import React, { FC, memo } from 'react'
import { classConnection } from '../../../../utils/function'
import ActiveLine from '../../../../UI/ActiveLine/ActiveLine';

import classes from './WorkTab.module.scss';
interface IWorkTab {
    className?: string;
    isActive: boolean;
    onClick: () => void;
    title?: string;
}

export const WorkTab: FC<IWorkTab> = memo(({ className, isActive, onClick, title = 'Все работы' }) => {
    return (
        <button
            className={classConnection(classes.tab, className)}
            onClick={onClick}
            aria-label={title}
        >
            {title}
            <span aria-hidden>
                {title}
            </span>
            <ActiveLine
                className={classes.tab__activeLine}
                layoutId={'Виды работ'}
                isActive={isActive}
            />
        </button>
    )
})

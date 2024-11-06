import { ReactNode, useMemo } from 'react'; 
import classes from './Grid.module.scss'; 
import { classConnection } from '../../utils/function';

export interface IBaseSlide { 
    id: string | number; 
} 

interface IGrid<T extends IBaseSlide> { 
    items: T[]; 
    renderItem: (item: T, index: number) => ReactNode; 
    className?: string; 
} 

const itemCountClasses = [ 
    classes.itemsCountMore, 
    classes.itemsCount1, 
    classes.itemsCount2, 
    classes.itemsCount3, 
    classes.itemsCount4, 
    classes.itemsCount5, 
    classes.itemsCount6, 
    classes.itemsCount7, 
    classes.itemsCount8, 
    classes.itemsCount9, 
]; 

const Grid = <T extends IBaseSlide>(
    { 
        items, 
        renderItem, 
        className 
    }: IGrid<T>
) => { 
    const itemsCountClass = useMemo(() => { 
        return itemCountClasses[Math.min(items.length, itemCountClasses.length - 1)]; 
    }, [items]); 

    if (!items.length) return null; 

    return ( 
        <div className={classConnection(itemsCountClass, classes.grid, className)}> 
            {items.map((item, index) => ( 
                renderItem(item, index) 
            ))} 
        </div> 
    ); 
};

export default Grid;
import { memo, FC, ReactNode } from 'react'

import classes from './ListItemController.module.scss'
import ControllerButton from '../../UI/ControllerButton/ControllerButton';
import { classConnection } from '../../utils/function';



interface IListItemController<T> {
    className?: string;
    itemClassName?: string;
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    renderItemToAdd?: () => ReactNode
    deleteItem?: (id: number) => void;
    addItem?: () => void;
    saveItem?: (item: T) => void;
    indexPadding?: string
    addIndex?: boolean
}

const ListItemController = <T extends { id: number }>({
    className,
    itemClassName,
    items,
    renderItem,
    renderItemToAdd,
    deleteItem,
    addItem,
    saveItem,
    indexPadding,
    addIndex = true
}: IListItemController<T>) => {
    return (
        <div className={classConnection(classes.listItemController, className)}>

            <div className={classConnection(
                classes.listItemController__list,
                addItem && renderItemToAdd ? classes.listItemController__list_haveAdd : ''
            )}>
                {
                    items && items.length
                        ? items?.map((item, index) => (
                            <div
                                className={classConnection(classes.listItemController__item, itemClassName)}
                                key={item.id || index}
                                style={{ paddingLeft: addIndex ? indexPadding : 0 }}
                            >
                                {
                                    addIndex
                                    && <span className={classes.listItemController__index}>{index + 1}.</span>
                                }
                                {renderItem(item, index)}
                                <div className={classes.listItemController__controllers}>
                                    {
                                        saveItem
                                            ? <ControllerButton
                                                className={classes.listItemController__controller}
                                                type='save'
                                                onClick={() => saveItem(item)}
                                            />
                                            : null
                                    }
                                    {
                                        deleteItem
                                            ? <ControllerButton
                                                className={classes.listItemController__controller}
                                                type='delete'
                                                onClick={() => deleteItem(item.id)}
                                            />
                                            : null
                                    }
                                </div>


                            </div>
                        ))
                        : null
                }
            </div>
            {
                addItem && renderItemToAdd
                    ? <div
                        className={classConnection(classes.listItemController__item, classes.listItemController__item_add, itemClassName)}
                        style={{ paddingLeft: addIndex ? indexPadding : 0, paddingRight: deleteItem && saveItem ? '30px' : 0 }}
                    >
                        {
                            addIndex
                            && <span className={classes.listItemController__index}>{items.length + 1}.</span>
                        }
                        {renderItemToAdd()}
                        <ControllerButton
                            className={classes.listItemController__controller}
                            type='add'
                            onClick={addItem}
                        />
                    </div>
                    : null
            }



        </div>
    )
}

export default ListItemController
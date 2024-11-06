import { ChangeEvent, FC, memo, useCallback } from 'react'
import classes from './WorkModalTag.module.scss'
import { IWorksTypeValue } from '../../../../http';

interface IWorkModalTag {
    types: IWorksTypeValue[];
    typeId?: number;
    setTypeId: (typeId?: number) => void;
}

export const WorkModalTag: FC<IWorkModalTag> = memo(({ types, typeId, setTypeId }) => {

    const onTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTypeId(Number.isNaN(+value) ? undefined : +value)
    }, [])

    return (
        <div className={classes.workModalTag}>
            <h4 className={classes.workModalTag__title}>Тег публикации:</h4>
            {
                types.length
                    ? <select
                        className={classes.workModalTag__selector}
                        value={typeId}
                        onChange={onTypeChange}
                        name='Тип поста'
                    >
                        <option value={undefined} defaultChecked>
                            Все
                        </option>
                        {types.map(type =>
                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.name}
                            </option>
                        )}

                    </select>
                    : null
            }
        </div>
    )

})

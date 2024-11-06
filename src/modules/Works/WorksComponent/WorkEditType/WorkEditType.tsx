import { FC, memo, useEffect, useState } from 'react'
import Input from '../../../../UI/Input/Input'

import useDebounce from '../../../../utils/hooks/useDebounce'

interface IWorkEditType {
    className?: string;
    id?: number;
    initialValue?: string | null;
    onTypeEdit: (id: number, name: string) => void;
}

export const WorkEditType: FC<IWorkEditType> = memo(({
    className,
    id,
    initialValue,
    onTypeEdit
}) => {
    const [name, setName] = useState<string>(initialValue || '')
    const debouncedName = useDebounce(name, 1000)

    useEffect(() => {
        if (debouncedName && debouncedName !== initialValue && id !== undefined) {
            onTypeEdit(id, debouncedName)
        }
    }, [initialValue, id, debouncedName])
    return (
        <Input
            className={className}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='Введите название'
            title='Название тега'
        />
    )
})
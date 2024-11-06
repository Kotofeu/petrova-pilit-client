import { FC, memo, useCallback, useEffect, useState } from 'react'
import TextArea from '../../../../UI/TextArea/TextArea'
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton'

import classes from './AdminTextArea.module.scss'
import { useMessage } from '../../../MessageContext';

interface IAdminTextArea {
    initialValue?: string;
    saveValue: (value: string) => void;
    minHeight?: string;
    maxHeight?: string;
}
export const AdminTextArea: FC<IAdminTextArea> = memo(({
    initialValue,
    saveValue,
    minHeight = '7em',
    maxHeight = '20em'
}) => {
    const [value, setValue] = useState<string>(initialValue || '')
    const { addMessage } = useMessage()
    const onSaveValue = useCallback(() => {
        if (value !== initialValue) {
            saveValue(value)
            addMessage('Значение сохранено', 'complete')
        }
        else addMessage('Значение не менялось', 'message')
    }, [value, initialValue])
    useEffect(() => {
        if (initialValue) {
            setValue(initialValue)
        }
    }, [initialValue])
    return (
        <div className={classes.adminTextArea}>
            <TextArea
                className={classes.adminTextArea__textArea}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                style={{
                    minHeight: minHeight, maxHeight: maxHeight
                }}
            />
            <ControllerButton
                className={classes.adminTextArea__save}
                type='save'
                onClick={onSaveValue}
            />
        </div>
    )
})

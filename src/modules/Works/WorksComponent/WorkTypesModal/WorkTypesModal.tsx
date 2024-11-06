import { FC, useCallback, useState } from 'react'
import ModalSend from '../../../../components/Modal/ModalSend';
import { observer } from 'mobx-react-lite';


import classes from './WorkTypesModal.module.scss';

import ListItemController from '../../../../components/ListItemController/ListItemController';
import { useMessage } from '../../../MessageContext';
import { IWork, worksStore } from '../../../../store';
import Input from '../../../../UI/Input/Input';
import { WorkEditType } from '../WorkEditType/WorkEditType';

interface IWorkTypesModal {
    isOpen: boolean;
    closeModal: () => void;
    tabs?: IWork[]
}
export const WorkTypesModal: FC<IWorkTypesModal> = observer(({
    isOpen,
    closeModal,
    tabs
}) => {
    const [newType, setNewType] = useState<string>('')
    const { addMessage } = useMessage()

    const tabAction = useCallback(async (action: () => Promise<void>, message: string) => {
        await action()
        if (!worksStore.error) {
            addMessage(message, 'complete');
        }
        else {
            addMessage(worksStore.error, 'error');
        }
    }, [newType, worksStore, worksStore.error, addMessage])


    const deleteHandler = useCallback((id: number) => {
        tabAction(() => worksStore.deleteWorkType(id), 'Тип удалён')
    }, [worksStore, tabAction])

    const addHandler = useCallback((name: string) => {
        if (name.length > 2) {
            tabAction(() => worksStore.addWorkType(name), 'Тип добавлен')
            setNewType('')
        }
        else {
            addMessage('Введите название больше 2 символов', 'error')
        }
    }, [setNewType, worksStore, tabAction])

    return (
        <ModalSend
            isOpen={isOpen}
            closeModal={closeModal}
        >
            <ListItemController
                className={classes.types}
                items={tabs || []}
                renderItem={(tab) => (
                    <WorkEditType
                        className={classes.type}
                        initialValue={tab.name}
                        id={tab.id}
                        onTypeEdit={(id, name) => tabAction(
                            () => worksStore.changeWorkTypeById(id, name),
                            'Тип изменён'
                        )}
                    />
                )}
                renderItemToAdd={() => (
                    <Input
                        className={classes.type}
                        value={newType}
                        onChange={(event) => setNewType(event.target.value)}
                        placeholder='Введите название'
                        title='Название нового тега'
                    />
                )}
                deleteItem={deleteHandler}
                addItem={() => addHandler(newType)}
                indexPadding='1.6em'
            />

        </ModalSend >
    )
})


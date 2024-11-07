import { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useMessage } from '../../../MessageContext'

import ListItemController from '../../../../components/ListItemController/ListItemController'
import Input from '../../../../UI/Input/Input'
import classes from './AdminAdvantages.module.scss'


import { IconLoader } from '../IconLoader/IconLoader'
import { applicationStore, IAdvantages, ICreateAdvantages } from '../../../../store'
import TextArea from '../../../../UI/TextArea/TextArea'

interface IAdvantageArray extends IAdvantages, ICreateAdvantages {
    id: number
}
export const AdminAdvantages: FC = observer(() => {
    const { addMessage } = useMessage();

    const [advantages, setAdvantages] = useState<IAdvantageArray[]>([]);
    const [newAdvantage, setNewAdvantage] = useState<ICreateAdvantages>({
        name: '',
        description: '',
        imageFile: undefined,
        iconFile: undefined
    })
    const advantageAction = useCallback(async (action: () => Promise<void>, message: string) => {
        await action()
        if (!applicationStore.error) {
            addMessage(message, 'complete');
        }
        else {
            addMessage(applicationStore.error, 'error');
        }
    }, [applicationStore, applicationStore.error, addMessage])

    const validateAdvantages = (advantage: IAdvantageArray) => {
        if (advantage.name && (advantage.name.length < 2)) return 'Заголовок должен быть длиннее 2 символов';
        if (advantage.description && (advantage.description.length < 2)) return 'Описание отсутствует';
        if (!advantage.iconFile && !advantage.iconSrc) return 'Отсутствует иконка';
        return null;
    };

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, type: 'name' | 'description') => {
        const { value } = event.target;
        setAdvantages(prev => prev.map(advantage =>
            advantage.id === id ? { ...advantage, [type]: value } : advantage
        ));
    }, []);

    const handleImageChange = useCallback((file: File | null, id: number, type: 'imageFile' | 'iconFile') => {
        setAdvantages(prev => prev.map(advantage =>
            advantage.id === id ? { ...advantage, [type]: file || undefined } : advantage
        ));
    }, []);


    const onAddAdvantage = useCallback(() => {
        const errorMessage = validateAdvantages(newAdvantage as (IAdvantageArray));
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        advantageAction(
            async () => applicationStore.addAdvantage(newAdvantage, newAdvantage.iconFile!),
            `Преимущество ${newAdvantage.name} добавлено`
        )
        setNewAdvantage({ name: '', description: '', imageFile: undefined, iconFile: undefined })
    }, [newAdvantage])


    const onSaveClick = useCallback((advantage: IAdvantageArray) => {
        const errorMessage = validateAdvantages(advantage);
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        advantageAction(
            async () => applicationStore.changeAdvantages(advantage.id, advantage, advantage.iconFile),
            `Преимущество ${newAdvantage.name} добавлено`
        )
    }, [])


    useEffect(() => {
        setAdvantages(applicationStore.advantages)
    }, [applicationStore.advantages])

    return (
        <ListItemController
            className={classes.adminAdvantages}
            itemClassName={classes.adminAdvantages__item}
            items={advantages}
            renderItem={(advantage) => (
                <div className={classes.adminAdvantages__row} key={advantage.id}>
                    <div className={classes.adminAdvantages__main}>
                        <IconLoader
                            className={classes.adminAdvantages__icon}
                            type='light'
                            setImage={(image) => handleImageChange(image, advantage.id, 'iconFile')}
                            image={
                                advantage.iconFile
                                    ? URL.createObjectURL(advantage.iconFile)
                                    : `${process.env.REACT_APP_API_URL_FILE}/${advantage.iconSrc}`
                            }
                            title='Иконка'
                        />
                        <div className={classes.adminAdvantages__inputs}>
                            <Input
                                className={classes.adminAdvantages__input}
                                value={advantage.name || ''}
                                onChange={(event) => handleChange(event, advantage.id, 'name')}
                                placeholder='Заголовок преимущества'
                                title='Заголовок преимущества'
                            />
                            <TextArea
                                className={classes.adminAdvantages__textArea}
                                value={advantage.description || ''}
                                onChange={(event) => handleChange(event, advantage.id, 'description')}
                                placeholder='Описание преимущества'
                                title='Описание преимущества' />
                        </div>
                    </div>

                </div>
            )}
            addItem={onAddAdvantage}
            deleteItem={(id) => advantageAction(async () => applicationStore.deleteAdvantages(id), `Преимущество удалено`)}
            saveItem={(advantage) => onSaveClick(advantage)}
            renderItemToAdd={() => (
                <div className={classes.adminAdvantages__row}>
                    <div className={classes.adminAdvantages__main}>
                        <IconLoader
                            className={classes.adminAdvantages__icon}
                            type='light'
                            setImage={(image) => setNewAdvantage(prev => ({ ...prev, iconFile: image || undefined }))}
                            image={newAdvantage.iconFile ? URL.createObjectURL(newAdvantage.iconFile) : undefined}
                            title='Иконка'
                        />
                        <div className={classes.adminAdvantages__inputs}>
                            <Input
                                className={classes.adminAdvantages__input}
                                value={newAdvantage?.name || ''}
                                onChange={(event) => setNewAdvantage(prev => ({ ...prev, name: event.target.value }))}
                                placeholder='Заголовок преимущества'
                                title='Заголовок преимущества'
                            />
                            <TextArea
                                className={classes.adminAdvantages__textArea}
                                value={newAdvantage?.description || ''}
                                onChange={(event) => setNewAdvantage(prev => ({ ...prev, description: event.target.value }))}
                                placeholder='Описание преимущества'
                                title='Описание преимущества'
                            />

                        </div>
                    </div>

                </div>
            )}
            addIndex={false}
        />
    );
});

import { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useMessage } from '../../../MessageContext'
import { servicesStore, IService } from '../../../../store'

import ListItemController from '../../../../components/ListItemController/ListItemController'
import Input from '../../../../UI/Input/Input'

import TextArea from '../../../../UI/TextArea/TextArea'

import classes from './AdminServices.module.scss'
import { IServiceValue } from '../../../../http/API/serviceApi'

export const AdminServices: FC = observer(() => {
    const [services, setServices] = useState<IService[]>([]);
    const [newServices, setNewServices] = useState<IServiceValue>({
        name: '',
        time: 0,
        description: '',
        price: 0,
    })

    const { addMessage } = useMessage();

    const serviceAction = useCallback(async (action: () => Promise<void>, message: string) => {
        await action()
        if (!servicesStore.error) {
            addMessage(message, 'complete');
        }
        else {
            addMessage(servicesStore.error, 'error');
        }
    }, [servicesStore, servicesStore.error, addMessage])

    const validateLink = (service: IServiceValue) => {
        if (service.name && (service.name.length < 2)) return 'Заголовок должен быть длиннее 2 символов';
        if (!service.description) return 'Описание отсутствует';
        if (!service.time) return 'Время работы';
        return null;
    };

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, type: 'name' | 'description') => {
        const { value } = event.target;
        setServices(prev => prev.map(service =>
            service.id === id ? { ...service, [type]: value } : service
        ));
    }, []);
    const handleNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, type: 'time' | 'price') => {
        const { value } = event.target;
        setServices(prev => prev.map(service =>
            service.id === id ? { ...service, [type]: Number(value) >= 0 ? +value : service[type] } : service
        ));
    }, []);

    const onAddService = useCallback(() => {
        const errorMessage = validateLink(newServices as IService);
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        serviceAction(
            async () => servicesStore.addService(newServices),
            `Услуга ${newServices.name} добавлена`
        )
        setNewServices({ name: '', time: 0, description: '', price: 0 })
    }, [newServices])


    const onSaveClick = useCallback((contactLink: IService) => {
        const errorMessage = validateLink(contactLink);
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        serviceAction(
            async () =>  servicesStore.changeService(contactLink),
            `Услуга ${contactLink.name} обновлена`
        )
    }, [])


    useEffect(() => {
        setServices(servicesStore.services || [])
    }, [servicesStore.services])

    return (
        <ListItemController
            className={classes.adminServices}
            itemClassName={classes.adminServices__item}
            items={services}
            renderItem={(service) => (
                <div className={classes.adminServices__row} key={service.id}>
                    <div className={classes.adminServices__inputs}>
                        <Input
                            className={classes.adminServices__input}
                            value={service.name ? service.name : ''}
                            onChange={(event) => handleChange(event, service.id, 'name')}
                            placeholder='Заголовок услуги'
                            title='Заголовок услуги'
                        />
                        <div className={classes.adminServices__inputsRow}>
                            <Input
                                className={classes.adminServices__input}
                                value={service.time ? `${service.time}` : ''}
                                onChange={(event) => handleNumberChange(event, service.id, 'time')}
                                placeholder='Время (мин)'
                                title='Время (мин)'
                                type='number'
                            />
                            <Input
                                className={classes.adminServices__input}
                                value={service.price ? `${service.price}` : ''}
                                onChange={(event) => handleNumberChange(event, service.id, 'price')}
                                placeholder='Цена (от)'
                                title='Цена (от)'
                                type='number'
                            />
                        </div>

                    </div>
                    <TextArea
                        className={classes.adminServices__textArea}
                        value={service.description || ''}
                        onChange={(event) => handleChange(event, service.id, 'description')}
                        placeholder='Описание услуги'
                        title='Описание услуги'
                    />
                </div>
            )}
            addItem={onAddService}
            deleteItem={(id) => serviceAction(async () => servicesStore.deleteService(id), `Услука удалена`)}
            saveItem={(service) => onSaveClick(service)}
            renderItemToAdd={() => (
                <div className={classes.adminServices__row}>
                    <div className={classes.adminServices__inputs}>
                        <Input
                            className={classes.adminServices__input}
                            value={newServices.name || ''}
                            onChange={(event) => setNewServices(prev => ({ ...prev, name: event.target.value }))}
                            placeholder='Заголовок услуги'
                            title='Заголовок услуги'
                        />
                        <div className={classes.adminServices__inputsRow}>
                            <Input
                                className={classes.adminServices__input}
                                value={newServices.time ? `${newServices.time}` : ''}
                                onChange={(event) => setNewServices(prev => ({ ...prev, time: Number(event.target.value) >= 0 ? Number(event.target.value) : 0 }))}
                                placeholder='Время (мин)'
                                title='Время (мин)'
                                type='number'
                            />
                            <Input
                                className={classes.adminServices__input}
                                value={newServices.price ? `${newServices.price}` : ''}
                                onChange={(event) => setNewServices(prev => ({ ...prev, price: Number(event.target.value) >= 0 ? Number(event.target.value) : 0 }))}
                                placeholder='Цена (от)'
                                title='Цена (от)'
                                type='number'
                            />
                        </div>

                    </div>
                    <TextArea
                        className={classes.adminServices__textArea}
                        value={newServices.description || ''}
                        onChange={(event) => setNewServices(prev => ({ ...prev, description: event.target.value }))}
                        placeholder='Описание услуги'
                        title='Описание услуги'
                    />
                </div>
            )}
            addIndex={false}
        />
    );
});

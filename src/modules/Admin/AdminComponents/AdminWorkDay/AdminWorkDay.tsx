import { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useMessage } from '../../../MessageContext'
import { applicationStore, IWorkSchedule } from '../../../../store'

import ListItemController from '../../../../components/ListItemController/ListItemController'
import Input from '../../../../UI/Input/Input'

import classes from './AdminWorkDay.module.scss'


export const AdminWorkDay: FC = observer(() => {
    const [workSchedule, setWorkSchedule] = useState(applicationStore.workSchedule || []);
    const { addMessage } = useMessage();
    const workScheduleHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setWorkSchedule(prev =>
            prev.map(workDay =>
                workDay.name === name ? { ...workDay, value } : workDay
            )
        );
    }, []);
    const onSaveClick = useCallback(async (workDay: IWorkSchedule) => {
        await applicationStore.changeWorkSchedule(workDay)
        if (!applicationStore.error) {
            addMessage(`Расписание на ${workDay.name} изменено`, 'complete')
        }
        else {
            addMessage(applicationStore.error, 'error')
        }
    }, [applicationStore.error])
    useEffect(() => {
        if (applicationStore.workSchedule) {
            setWorkSchedule(applicationStore.workSchedule)
        }
    }, [applicationStore.workSchedule])
    return (
        <ListItemController
            className={classes.adminWorkDay}
            itemClassName={classes.adminWorkDay__item}
            items={workSchedule}
            renderItem={(workDay) => (
                <div className={classes.adminWorkDay__row} key={workDay.id}>
                    <p
                        className={classes.adminWorkDay__name}
                    >
                        {workDay.name}:
                    </p>
                    <p
                        className={classes.adminWorkDay__shortName}
                    >
                        {workDay.shortName}:
                    </p>
                    <Input
                        className={classes.adminWorkDay__input}
                        value={workDay.value || ''}
                        onChange={workScheduleHandler}
                        name={workDay?.name || ''}
                        placeholder='00:00 - 00:00'
                        title={`Расписание на ${workDay.name}`}
                    />

                </div>
            )}
            saveItem={onSaveClick}
            addIndex={false}
        />
    );
});

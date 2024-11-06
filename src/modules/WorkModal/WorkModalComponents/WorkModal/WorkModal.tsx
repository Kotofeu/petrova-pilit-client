import { FC, useCallback, useEffect, useState } from 'react'
import ModalSend from '../../../../components/Modal/ModalSend'
import { observer } from 'mobx-react-lite'
import { applicationStore, IGetAllJSON, IWork, IWorksType, worksStore } from '../../../../store'

import classes from './WorkModal.module.scss'
import Button from '../../../../UI/Button/Button'
import { WorkModalTag } from '../WorkModalTag/WorkModalTag'
import Input from '../../../../UI/Input/Input'
import { useMessage } from '../../../MessageContext'
import { WorkModalImages } from '../WorkModalImages/WorkModalImages'
import TextArea from '../../../../UI/TextArea/TextArea'
import { IWorkValue, workTypeApi } from '../../../../http'
import useRequest from '../../../../utils/hooks/useRequest'
import Loader from '../../../../UI/Loader/Loader'

interface IWorkModal {
    work?: IWork;
}
const initialWorkValue: IWorkValue = {
    name: '',
    description: '',
    typeId: undefined,
    imageAfterSrc: '',
    imageBeforeSrc: '',
    images: []
}
export const WorkModal: FC<IWorkModal> = observer(({ work }) => {
    const { addMessage } = useMessage()

    const [workTypes, workTypesIsLoading, workTypesError]
        = useRequest<IGetAllJSON<IWorksType>>(workTypeApi.getWorkTypes);

    useEffect(() => {
        if (workTypes?.count) { worksStore.setWorkTypes(workTypes.rows) }
    }, [workTypes])

    useEffect(() => {
        if (workTypesError && workTypesError !== applicationStore.error) {
            applicationStore.setError(workTypesError)
            addMessage(workTypesError, 'error')
        }
    }, [workTypesError])


    const [workValues, setWorkValues] = useState<IWorkValue>(work || initialWorkValue)
    const [action, setAction] = useState<'type' | 'text' | 'photo'>('type');

    const [beforeImage, setBeforeImage] = useState<File | null>(null)
    const [afterImage, setAfterImage] = useState<File | null>(null)
    const [otherImages, setOtherImages] = useState<File[] | null>(null)
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([])

    const closeModal = useCallback(() => {
        worksStore.setIsWorkCreating(false)
        setAction('type')
        setBeforeImage(null)
        setAfterImage(null)
        setOtherImages(null)
    }, [worksStore])

    const onConfirm = useCallback(async () => {
        if (action === 'type') {
            setAction('text')
        }
        else if (action === 'text') {
            if (!workValues.name || workValues.name && workValues.name.length < 2) {
                addMessage('Введите название больше 2 символов', 'error')
                return
            }
            else if (!workValues.description || workValues.description && workValues.description.length < 2) {
                addMessage('Введите описание', 'error')
                return
            }
            else {
                setAction('photo')
            }
        }
        else {
            if (!work) {
                if (!beforeImage && !afterImage) {
                    addMessage('Добавьте изображение до и/или после', 'error')
                    return
                }
                else {
                    await worksStore.addWork(workValues, afterImage, beforeImage, otherImages)
                }
            }
            else {
                await worksStore.changeById(work.id, workValues, afterImage, beforeImage, otherImages, imagesToDelete)
            }
            if (worksStore.error) {
                addMessage(worksStore.error, 'error')
                return
            }
            else {
                addMessage('Работа сохранена', 'complete')
                closeModal()
            }
        }
    }, [worksStore, workValues, action, imagesToDelete, beforeImage, afterImage, otherImages, worksStore.error, closeModal])



    const onBack = useCallback(() => {
        if (action === 'photo') {
            setAction('text')
        }
        else if (action === 'text') {
            setAction('type')
        }
        else {
            closeModal()
        }
    }, [action, setAction, closeModal])

    useEffect(() => {
        if (worksStore.isWorkCreating) {
            if (work) {
                setWorkValues({
                    name: work.name,
                    description: work.description,
                    typeId: work.workType?.id,
                    imageAfterSrc: work.imageAfterSrc,
                    imageBeforeSrc: work.imageBeforeSrc,
                    images: work.images
                })
            }
            else {
                setWorkValues(initialWorkValue)
            }
        }
    }, [work, worksStore.isWorkCreating])

    return (
        <ModalSend
            isOpen={worksStore.isWorkCreating}
            closeModal={closeModal}
        >
            <div className={classes.workModal}>
                <div className={classes.workModal__inner}>
                    <h3 className={classes.workModal__title}>
                        {
                            work
                                ? 'Редактирование работы'
                                : 'Создание работы'
                        }
                    </h3>

                    {
                        worksStore.workTypes.length && action === 'type'
                            ? <WorkModalTag
                                types={worksStore.workTypes}
                                typeId={workValues.typeId || undefined}
                                setTypeId={(type) => setWorkValues(prev => ({ ...prev, typeId: type }))}
                            />
                            : null
                    }
                    {
                        action === 'text'
                            ? <div className={classes.workModal__text}>
                                <Input
                                    className={classes.workModal__inputTitle}
                                    value={workValues.name || ''}
                                    onChange={(event) => setWorkValues(prev => ({ ...prev, name: event.target.value }))}
                                    name='title'
                                    title='Заголовок публикации'
                                    placeholder='Заголовок публикации'
                                />
                                <TextArea
                                    className={classes.workModal__description}
                                    value={workValues.description || ''}
                                    onChange={(event) => setWorkValues(prev => ({ ...prev, description: event.target.value }))}
                                    name='description'
                                    title='Текст публикации'
                                    placeholder='Текст публикации'
                                />
                            </div>
                            : null
                    }
                    {
                        action === 'photo'
                            ? <WorkModalImages
                                className={classes.workModal__photos}
                                initialAfter={workValues.imageAfterSrc}
                                initialBefore={workValues.imageBeforeSrc}
                                initialOtherImages={workValues.images}
                                setAfter={setAfterImage}
                                setBefore={setBeforeImage}
                                setOthers={setOtherImages}
                                setImagesToDelete={setImagesToDelete}
                                title={workValues.name || ''}
                            />
                            : null
                    }
                </div>
                <div className={classes.workModal__buttons}>
                    <Button
                        className={classes.workModal__button}
                        onClick={onBack}
                    >
                        {action === 'type' ? 'Закрыть' : 'Назад'}
                    </Button>
                    <Loader
                        isLoading={worksStore.isLoading || workTypesIsLoading}
                    />
                    <Button
                        className={classes.workModal__button}
                        onClick={onConfirm}
                        disabled={worksStore.isLoading}
                    >
                        {action === 'photo' ? 'Сохранить' : 'Далее'}
                    </Button>
                </div>

            </div>
        </ModalSend>
    )
})

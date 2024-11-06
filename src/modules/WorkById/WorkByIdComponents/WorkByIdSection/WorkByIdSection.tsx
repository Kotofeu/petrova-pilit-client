import { FC, memo, useCallback, useState } from 'react'
import classes from './WorkByIdSection.module.scss'
import Section from '../../../../components/Section/Section'
import DateTime from '../../../../UI/DateTime/DateTime'
import BeforeAfterSlider from '../../../../components/BeforeAfterSlider/BeforeAfterSlider'
import { WorkImagesGrid } from '../WorkImagesGrid/WorkImagesGrid'
import ControllerButton from '../../../../UI/ControllerButton/ControllerButton'
import ModalOk from '../../../../components/Modal/ModalOk'
import Error404 from '../../../../components/Error404/Error404'
import { WORKS_ROUTE } from '../../../../utils/const/routes'
import { IWork, worksStore } from '../../../../store'
import { classConnection } from '../../../../utils/function'
import ServerImage from '../../../../UI/ServerImage/ServerImage'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useMessage } from '../../../MessageContext'
import Loader from '../../../../UI/Loader/Loader'

interface IWorkByIdSection {
    work?: IWork;
    isAdmin?: boolean;
    isLoading?: boolean;
    openModal: () => void;
}

export const WorkByIdSection: FC<IWorkByIdSection> = observer(({
    work,
    isAdmin = false,
    isLoading,
    openModal,
}) => {
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const router = useNavigate();
    const { addMessage } = useMessage();

    const deleteWork = useCallback(async () => {
        if (work?.id) {
            await worksStore.deleteWork(work.id);
        }
        if (!worksStore.error) {
            addMessage('Работа удалена', 'message');
            setIsDelete(false)
            router(WORKS_ROUTE)
        }
        else {
            addMessage(worksStore.error, 'error');
        }
    }, [work?.id, worksStore.error, addMessage])

    if ((!work || (!work.imageAfterSrc && !work.imageBeforeSrc) || !work.name) || isLoading) {
        if (isLoading) {
            return (
                <Section className={classes.workById}>
                    <div className={classConnection(classes.workById__inner, 'loading')}>
                        <div className={classes.workById__inner_empty}>
                        </div>
                    </div>
                </Section>
            )
        }
        else {
            return (
                <Error404
                    page={WORKS_ROUTE}
                    text='Работа не найдена'
                    buttonText='Вернуться к работам'
                />
            )
        }
    }

    return (
        <>
            <Section className={classes.workById} isUnderline={!!work.images?.length}>
                <Loader
                    className={classes.workById__loader}
                    isLoading={worksStore.isLoading}
                />
                {
                    isAdmin
                        ? <div className={classes.workById__buttons}>
                            <ControllerButton
                                className={classes.workById__button}
                                onClick={openModal}
                                title='Редактировать пост'
                                type='edit'
                            />
                            <ControllerButton
                                className={classes.workById__button}
                                onClick={() => setIsDelete(true)}
                                title='Удалить пост'
                                type='delete'
                            />
                        </div>
                        : null
                }

                <div className={classes.workById__inner}>
                    {
                        (work.imageAfterSrc && work.imageBeforeSrc)
                            ? <BeforeAfterSlider
                                className={classes.workById__slider}
                                before={work.imageBeforeSrc ? `${process.env.REACT_APP_API_URL}/${work.imageBeforeSrc}` : ''}
                                after={work.imageAfterSrc ? `${process.env.REACT_APP_API_URL}/${work.imageAfterSrc}` : ''}

                            />
                            : <ServerImage
                                className={classes.workById__preview}
                                src={work.imageAfterSrc || work.imageBeforeSrc || ''}
                                alt={work.name}
                            />
                    }
                    <div className={classes.workById__text}>
                        <h1 className={classes.workById__title}>{work.name}</h1>
                        {
                            work.createdAt
                                ? <DateTime
                                    className={classes.workById__date}
                                    date={work.createdAt}
                                    addTime
                                />
                                : null
                        }

                        <div
                            className={classes.workById__desc}
                        >
                            {
                                !!work.description && work.description?.split('\n').map(paragraph =>
                                    <p
                                        className={classes.workById__paragraph}
                                        key={paragraph}
                                    >
                                        {paragraph}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Section>
            {
                work.images?.length ?
                    <WorkImagesGrid
                        images={work.images}
                    />
                    : null
            }
            <ModalOk
                isOpen={isDelete}
                closeModal={() => setIsDelete(false)}
                onOkClick={deleteWork}
            />
        </>


    )
})

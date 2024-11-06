import { useState, useEffect } from 'react'
import Background from '../../../../assets/images/heart.png';

import Section from '../../../../components/Section/Section'
import classes from './OfficeSection.module.scss'
import { OfficeModal } from '../OfficeModal/OfficeModal';
import { OfficeGrid } from '../OfficeGrid/OfficeGrid';
import useRequest from '../../../../utils/hooks/useRequest';
import { applicationStore, IGetAllJSON, IImages } from '../../../../store';
import { officeApi } from '../../../../http';
import { useMessage } from '../../../MessageContext';
import { observer } from 'mobx-react-lite';
import Grid from '../../../../components/Grid/Grid';


export const OfficeSection = observer(() => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { addMessage } = useMessage()

    const [activeImage, setActiveImage] = useState<number>(0)
    const [
        officeImages,
        officeImagesIsLoading,
        officeImagesError
    ] = useRequest<IGetAllJSON<IImages>>(officeApi.getImages);
    
    useEffect(() => {
        if (officeImagesError && officeImagesError !== applicationStore.error) {
            applicationStore.setError(officeImagesError)
            addMessage(officeImagesError, 'error')
        }
    }, [officeImagesError])
    useEffect(() => {
        if (officeImages?.rows.length) {
            applicationStore.setOfficeImages(officeImages.rows)
        }
    }, [officeImages])
    const openModal = (index: number) => {
        setIsOpen(true)
        setActiveImage(index)
    }
    const closeModal = () => {
        setIsOpen(false)
        setActiveImage(0)
    }
    return (
        <Section className={classes.officeSection} backgroundImage={Background}>
            <h2 className={classes.officeSection__title}>
                Моя <span> мастерская </span>
            </h2>
            {
                officeImagesIsLoading
                    ? <Grid
                        className={classes.officeSection__empty}
                        items={[1, 2, 3, 4].map(i => ({ id: i }))}
                        renderItem={(i) => (
                            <div
                                key={i.id}
                                className={classes.officeSection__item_empty}
                            >
                                <div className='loading'></div>
                            </div>
                        )}
                    />
                    : <OfficeGrid
                        openModal={openModal}
                        images={applicationStore.officeImages.length ? applicationStore.officeImages : applicationStore.defaultOfficeImages}
                    />
            }

            <OfficeModal
                isOpen={isOpen}
                closeModal={closeModal}
                activeImage={activeImage}
                images={applicationStore.officeImages.length ? applicationStore.officeImages : applicationStore.defaultOfficeImages}
            />
        </Section>
    )
})

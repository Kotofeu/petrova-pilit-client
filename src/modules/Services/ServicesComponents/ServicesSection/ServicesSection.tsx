import { useEffect, useState } from 'react'
import Section from '../../../../components/Section/Section'
import Avatar from '../../../../components/Avatar/Avatar'
import Accordion from '../../../../components/Accordion/Accordion'
import { observer } from 'mobx-react-lite'
import { applicationStore, IGetAllJSON, IService, servicesStore } from '../../../../store'
import { ServicesTitle } from '../ServicesTitle/ServicesTitle'
import classes from './ServicesSection.module.scss'

import { ServicesDescription } from '../ServicesDescription/ServicesDescription'
import { serviceApi } from '../../../../http'
import useRequest from '../../../../utils/hooks/useRequest'
import { useMessage } from '../../../MessageContext'
import { classConnection } from '../../../../utils/function'
export const ServicesSection = observer(() => {
    const [isServiceOpen, setIsServiceOpen] = useState<number | null>(null)
    const { addMessage } = useMessage()

    const [
        services,
        servicesIsLoading,
        servicesError
    ] = useRequest<IGetAllJSON<IService>>(serviceApi.getServices);
    
    useEffect(() => {
        if (servicesError && servicesError !== applicationStore.error) {
            applicationStore.setError(servicesError)
            addMessage(servicesError, 'error')
        }
    }, [servicesError])


    useEffect(() => {
        if (services?.rows.length) {
            servicesStore.setServices(services.rows)
        }
    }, [services])


    return (
        <Section className={classes.services}>
            <h2 className={classes.services__title}>Цены на услуги</h2>
            <div className={classes.services__inner}>
                <Avatar className={classes.services__avatar} />

                {
                    !servicesStore.services.length
                        ? <div className={classes.services__accordion_empty}>
                            {
                                [1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={
                                            classConnection(
                                                classes.services__empty,
                                                servicesIsLoading ? 'loading' : ''
                                            )}
                                    />

                                ))
                            }

                        </div>
                        : <Accordion
                            className={classes.services__accordion}
                            items={servicesStore.services}
                            selectedItem={isServiceOpen}
                            setSelectedItem={setIsServiceOpen}
                            renderTitle={(service, index) => {
                                if (!service.name) return null
                                return (
                                    <ServicesTitle
                                        className={classes.services__servicesTitle}
                                        name={service.name}
                                        time={service.time || 0}
                                        price={service.price || 0}

                                    />
                                )
                            }
                            }
                            renderDescription={(service, index) => {
                                if (!service.description) return null
                                return (
                                    <ServicesDescription
                                        className={classes.services__description}
                                        description={service.description}
                                    />
                                )
                            }}
                        />
                }

            </div>
        </Section>
    )
})
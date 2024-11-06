import classes from './AdvantagesSection.module.scss'
import { Slider } from '../../../../components/Slider'
import { observer } from 'mobx-react-lite'
import { applicationStore, IAdvantages, IGetAllJSON } from '../../../../store'
import { AdvantagesCard } from '../AdvantagesCard/AdvantagesCard'
import Section from '../../../../components/Section/Section'
import useRequest from '../../../../utils/hooks/useRequest'
import { advantageApi } from '../../../../http'
import { useMessage } from '../../../MessageContext'
import { useEffect } from 'react'
import { classConnection } from '../../../../utils/function'

export const AdvantagesSection = observer(() => {
    const { addMessage } = useMessage()

    const [
        advantages,
        advantagesIsLoading,
        advantagesError
    ] = useRequest<IGetAllJSON<IAdvantages>>(advantageApi.getAdvantages);

    useEffect(() => {
        if (advantagesError && advantagesError !== applicationStore.error) {
            applicationStore.setError(advantagesError)
            addMessage(advantagesError, 'error')
        }
    }, [advantagesError])
    useEffect(() => {
        if (advantages?.rows.length) {
            applicationStore.setAdvantages(advantages.rows)
        }
    }, [advantages])
    return (
        <Section
            className={classes.advantagesSection}
        >
            <div className={classes.advantagesSection__inner}>
                <h2 className={classes.advantagesSection__title}>Приходите и убедитесь сами</h2>
                {
                    !applicationStore.advantages.length
                        ? <div className={classes.advantagesSection__slider_empty}>
                            {
                                [1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={
                                            classConnection(
                                                classes.advantagesSection__card_empty,
                                                advantagesIsLoading ? 'loading' : ''
                                            )}
                                    />

                                ))
                            }

                        </div>
                        : <Slider
                            className={classes.advantagesSection__slider}
                            items={applicationStore.advantages}
                            addDots
                            draggable
                            looped
                            autoplay
                            autoplayDelay={5000}
                            slideClassName={classes.advantagesSection__slide}
                            renderItem={(advantage) =>
                                <AdvantagesCard
                                    className={classes.advantagesSection__card}
                                    key={advantage.id}
                                    title={advantage.name}
                                    description={advantage.description}
                                    imageSrc={advantage.iconSrc}
                                />
                            }
                            breakpoints={[
                                {
                                    width: 600,
                                    slideToShow: 2,
                                    slideToScroll: 1,
                                },
                                {
                                    width: 900,
                                    slideToShow: 3,
                                    slideToScroll: 1,
                                },
                                {
                                    width: 1200,
                                    slideToShow: 4,
                                    slideToScroll: 1,
                                },
                            ]}
                            slidesToShow={1}
                            slidesToScroll={1}
                        />
                }

            </div>

        </Section>

    )
})

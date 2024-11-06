import { useRef } from 'react'
import Section from '../../../../components/Section/Section'

import { policy } from '../../policy';
import classes from './PolicySection.module.scss'
import { PolicyNavigation } from '../PolicyNavigation/PolicyNavigation';
import { PolicyParagraph } from '../PolicyParagraph/PolicyParagraph';

export const PolicySection = () => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToSection = (index: number) => {
        const section = sectionRefs.current[index];
        if (section) {
            const offset = 90;
            const top = section.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };
    return (
        <Section className={classes.policy}>
            <div className={classes.policy__inner}>
                <h2 className={classes.policy__title}>Политика конфиденциальности</h2>
                <PolicyNavigation scrollToSection={scrollToSection} />
                <div className={classes.policy__content}>
                    {policy.map((section, index) => (
                        <PolicyParagraph
                            key={index}
                            rel={el => (sectionRefs.current[index] = el)}
                            section={section}
                        />
                    ))}
                </div>
            </div>
        </Section>
    )
}

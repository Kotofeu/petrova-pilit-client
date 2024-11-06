import { observer } from 'mobx-react-lite';
import ContactLink from '../../../../UI/ContactLink/ContactLink';
import { applicationStore } from '../../../../store';
import classes from '../Footer/Footer.module.scss';
import { classConnection } from '../../../../utils/function';

export const ContactLinks = observer(() => (
    <div className={classes.footer__column}>
        <h6 className={classes.footer__columnTitle}>Контакты</h6>
        <div className={classes.footer__linksList}>
            {
                applicationStore.contactLinks.length
                    ? applicationStore.contactLinks.map(link => {
                        if (!link.link || !link.name || !link.imageSrc) return null
                        return (
                            <ContactLink
                                className={classes.footer__link}
                                key={link.id}
                                href={link.link}
                                title={link.name}
                                linkType="socialLink"
                                imageSrc={link.imageSrc}
                            >
                                {link.name}
                            </ContactLink>
                        )
                    })
                    : [1, 2, 3].map(item => (
                        <span
                            key={item}
                            className={classConnection(classes.footer__link_empty, 'loading')}
                        />
                    ))
            }
        </div>
    </div>
));
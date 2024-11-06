import { memo, FC } from 'react'
import classes from './ContactLink.module.scss'
import { classConnection } from '../../utils/function';
import ServerImage from '../ServerImage/ServerImage';

interface IContactLink {
    className?: string;
    linkType?: 'mail' | 'tel' | 'socialLink';
    href: string;
    children?: string;
    imageSrc?: string;
    title?: string;
    ariaLabel?: string
}
const ContactLink: FC<IContactLink> = memo((props) => {
    const { className = '', linkType, href, children, imageSrc, title, ariaLabel = title } = props
    let contactType: string = '';
    const joinClass = classConnection(classes.contact, classes[`contact__${linkType}`], className);
    if (linkType === 'mail') contactType = 'mailto:'
    if (linkType === 'tel') contactType = 'tel:'
    if (contactType && linkType) {
        return (
            <a
                className={joinClass}
                href={`${contactType}${href}`}
                title={title}
                aria-label={ariaLabel}
            >
                {children ?? href}
            </a>
        )
    }
    if (linkType === 'socialLink') {
        return (
            <a
                className={joinClass}
                href={href}
                target="_blank"
                title={title}
                aria-label={ariaLabel}
                rel="noopener noreferrer"
            >
                <ServerImage
                    className={classes.contact_socialImage}
                    src={imageSrc || ''}
                    alt={''}
                    aria-hidden
                />
                <span>{children}</span>
            </a>
        )
    }
    return (
        <a className={joinClass} href={href}>{children}</a>
    )
})
export default ContactLink
import { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useMessage } from '../../../MessageContext'
import { applicationStore, IContactLink, ICreateContactLink } from '../../../../store'

import ListItemController from '../../../../components/ListItemController/ListItemController'
import Input from '../../../../UI/Input/Input'
import classes from './AdminSocial.module.scss'


import { IconLoader } from '../IconLoader/IconLoader'
import TextArea from '../../../../UI/TextArea/TextArea'

interface IChooseContactLink extends IContactLink, ICreateContactLink {
    id: number
}
export const AdminSocial: FC = observer(() => {
    const [socialLinks, setSocialLinks] = useState<IChooseContactLink[]>([]);
    const [newSocialLinks, setNewSocialLinks] = useState<ICreateContactLink>({
        name: '',
        link: '',
    })

    const { addMessage } = useMessage();

    const contactAction = useCallback(async (action: () => Promise<void>, message: string) => {
        await action()
        if (!applicationStore.error) {
            addMessage(message, 'complete');
        }
        else {
            addMessage(applicationStore.error, 'error');
        }
    }, [applicationStore, applicationStore.error, addMessage])

    const validateLink = (link: IChooseContactLink) => {
        if (link.name && (link.name.length < 2)) return 'Заголовок должен быть длиннее 2 символов';
        if (link.link && (link.link.length < 2)) return 'Ссылка отсутствует';
        if (!link.imageFile && !link.imageSrc) return 'Отсутствует иконка';
        return null;
    };

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, type: 'name' | 'link') => {
        const { value } = event.target;
        setSocialLinks(prev => prev.map(contactLink =>
            contactLink.id === id ? { ...contactLink, [type]: value } : contactLink
        ));
    }, []);

    const handleImageChange = useCallback((file: File | null, id: number) => {
        setSocialLinks(prev => prev.map(contactLink =>
            contactLink.id === id ? { ...contactLink, imageFile: file || undefined } : contactLink
        ));
    }, []);


    const onAddLink = useCallback(() => {
        const errorMessage = validateLink(newSocialLinks as IChooseContactLink);
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        contactAction(async () => applicationStore.addContactLink(newSocialLinks, newSocialLinks.imageFile!), `Ссылка на ${newSocialLinks.name} добавлена`)
        setNewSocialLinks({ name: '', link: '', imageFile: undefined })
    }, [newSocialLinks])


    const onSaveClick = useCallback((contactLink: IChooseContactLink) => {
        const errorMessage = validateLink(contactLink);
        if (errorMessage) {
            addMessage(errorMessage, 'error');
            return;
        }
        contactAction(async () => applicationStore.changeContactLink(contactLink.id, contactLink, contactLink.imageFile), `Ссылка на ${contactLink.name} обновлена`)
    }, [])


    useEffect(() => {
        setSocialLinks(applicationStore.contactLinks)
    }, [applicationStore.contactLinks])

    return (
        <ListItemController
            className={classes.adminSocial}
            itemClassName={classes.adminSocial__item}
            items={socialLinks}
            renderItem={(socialLink) => (
                <div className={classes.adminSocial__row} key={socialLink.id}>
                    <div className={classes.adminSocial__icons}>
                        <IconLoader
                            className={classes.adminSocial__icon}
                            type='dark'
                            setImage={(image) => handleImageChange(image, socialLink.id)}
                            image={
                                socialLink.imageFile
                                    ? URL.createObjectURL(socialLink.imageFile)
                                    : `${process.env.REACT_APP_API_URL_FILE}/${socialLink.imageSrc}`
                            }
                            title='Иконка'
                        />
                    </div>
                    <div className={classes.adminSocial__inputs}>
                        <Input
                            className={classes.adminSocial__input}
                            value={socialLink.name || ''}
                            onChange={(event) => handleChange(event, socialLink.id, 'name')}
                            placeholder='Заголовок ссылки'
                            title='Заголовок ссылки'
                        />
                        <TextArea
                            className={classes.adminSocial__textArea}
                            value={socialLink.link || ''}
                            onChange={(event) => handleChange(event, socialLink.id, 'link')}
                            placeholder='Ссылка'
                            title='Ссылка'
                        />

                    </div>

                </div>
            )}
            addItem={onAddLink}
            deleteItem={(id) => contactAction(async () => applicationStore.deleteContactLink(id), `Ссылка удалена`)}
            saveItem={(socialLink) => onSaveClick(socialLink)}
            renderItemToAdd={() => (
                <div className={classes.adminSocial__row}>
                    <div className={classes.adminSocial__icons}>
                        <IconLoader
                            className={classes.adminSocial__icon}
                            type='dark'
                            setImage={(image) => setNewSocialLinks(prev => ({ ...prev, imageFile: image || undefined }))}
                            image={newSocialLinks.imageFile ? URL.createObjectURL(newSocialLinks.imageFile) : undefined}
                            title='Иконка'
                        />
                    </div>
                    <div className={classes.adminSocial__inputs}>
                        <Input
                            className={classes.adminSocial__input}
                            value={newSocialLinks?.name || ''}
                            onChange={(event) => setNewSocialLinks(prev => ({ ...prev, name: event.target.value }))}
                            placeholder='Заголовок ссылки'
                            title='Заголовок ссылки'
                        />
                        <TextArea
                            className={classes.adminSocial__textArea}
                            value={newSocialLinks?.link || ''}
                            onChange={(event) => setNewSocialLinks(prev => ({ ...prev, link: event.target.value }))}
                            placeholder='Ссылка'
                            title='Ссылка'
                        />

                    </div>

                </div>
            )}
            addIndex={false}
        />
    );
});

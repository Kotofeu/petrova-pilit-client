import { memo, FC} from 'react';
import FileInput from '../../../../components/FileInput/FileInput';
import { classConnection } from '../../../../utils/function';

import classes from './IconLoader.module.scss';

interface IIconLoader {
    className?: string;
    type?: 'dark' | 'light';
    setImage: (file: File | null) => void;
    image?: string;
    title?: string;
}

export const IconLoader: FC<IIconLoader> = memo(({ className, image, setImage, type = 'dark', title }) => {

    return (
        <div className={classConnection(classes.icon, className)}>
            {image && (
                <div className={classes.icon__iconBox}>
                    <img
                        className={classes.icon__iconImage}
                        src={image}
                        alt={title || 'Icon'}
                    />
                </div>
            )}
            <FileInput
                className={classConnection(
                    classes.icon__iconInput,
                    type === 'light' ? classes.icon__iconInput_dark : ''
                )}
                handleFileChange={setImage}
                type='icon'
                title={title || 'Upload Icon'}
            />
        </div>
    );
});
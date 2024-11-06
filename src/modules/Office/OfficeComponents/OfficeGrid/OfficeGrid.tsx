import { FC, memo } from 'react';
import Grid from '../../../../components/Grid/Grid';
import { IImages } from '../../../../store';
import classes from './OfficeGrid.module.scss';
import ServerImage from '../../../../UI/ServerImage/ServerImage';

export interface IOfficeGrid {
    openModal: (index: number) => void;
    images?: IImages[];
}

export const OfficeGrid: FC<IOfficeGrid> = memo(({ openModal, images}) => {
    return (
        <Grid
            className={classes.officeGrid}
            items={images || []}
            renderItem={(image, index) => {
                if (!image.imageSrc || !image.id) return null
                return (
                    <ServerImage
                        className={classes.officeGrid__image}
                        key={image.id}
                        src={image.imageSrc}
                        alt={`Мой офис: ${index + 1}`}
                        onClick={() => openModal(index)}
                    />
                )
            }}
        />
    )
}
);
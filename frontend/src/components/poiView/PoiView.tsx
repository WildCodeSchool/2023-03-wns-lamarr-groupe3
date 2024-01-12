import { CardType, Poi } from '../../utils/types';
import ModalePOI from '../modalePOI/modalePOI';
import Card from '../common/card/Card';
import styles from './poiView.module.scss';

interface Props {
   poi: Poi;
   openOnClick: (id: string) => void;
   modaleOpen: string | null;
   onClose: () => void;
   handleFavourite: (id: string | null, cardType: CardType) => void;
   isLiked: (id: string | null) => boolean;
}

const PoiView = ({
   poi,
   modaleOpen,
   openOnClick,
   onClose,
   handleFavourite,
   isLiked,
}: Props) => {
   return (
      <div className={styles.container}>
         {modaleOpen === poi.id ? (
            <ModalePOI
               poi={poi}
               onClose={onClose}
               isLiked={isLiked}
               handleFavourite={handleFavourite}
            />
         ) : (
            <Card
               data={poi}
               cardType={CardType.POI}
               onClick={() =>
                  modaleOpen === poi.id ? onClose() : openOnClick(poi.id ?? '')
               }
               handleFavourite={handleFavourite}
               isLiked={isLiked}
            />
         )}
      </div>
   );
};

export default PoiView;

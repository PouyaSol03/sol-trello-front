// CollectionPage.jsx
import { useParams } from 'react-router-dom';


const CollectionPage = () => {
  const { collectionName } = useParams();
  const content = collectionsContent[collectionName] || "Content not found";

  return (
    <div>
      
    </div>
  );
};

export {CollectionPage};

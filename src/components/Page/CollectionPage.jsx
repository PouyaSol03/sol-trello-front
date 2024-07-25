import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentPage } from '../contentPage/ContentPage';
import { Gallery } from '../Gallery';

const CollectionPage = () => {
  const { collectionName } = useParams();
  const [namePages, setNamePages] = useState([]);
  const [selectedButton, setSelectedButton] = useState(1); // Set default to 1

  useEffect(() => {
    const fetchNamePages = async () => {
      try {
        const response = await fetch("https://apisoltrello.liara.run/api/content/name-page/");
        if (!response.ok) {
          throw new Error('Failed to fetch name pages');
        }
        const data = await response.json();
        setNamePages(data);
      } catch (error) {
        console.error("Error fetching name pages:", error);
      }
    };

    fetchNamePages();
  }, []);

  const buttons = [
    { id: 1, label: 'محتوا اختصاصی' },
    { id: 2, label: 'گالری' },
    { id: 3, label: 'موجودی محتوا' },
    { id: 4, label: 'مشخصات مجموعه' }
  ];

  const renderContent = () => {
    switch (selectedButton) {
      case 1:
        return <ContentPage />;
      case 2:
        return <Gallery />;
      default:
        return null;
    }
  };

  return (
    <section className='w-screen h-screen flex justify-center items-center p-3 bg-slate-200 gap-2'>
      <aside className='w-1/6 h-full bg-white rounded-lg p-4'>
        <h2 className='w-full text-center font-bold'>منوی اختصاصی</h2>
        <div className="mt-4">
          {namePages.map(page => (
            <Link
              key={page.id}
              to={`/collection/${page.name}`}
              className={`block w-full text-center p-2 my-1 rounded-lg ${page.name === collectionName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {page.name}
            </Link>
          ))}
        </div>
      </aside>
      <main className='w-full h-full bg-white rounded-lg flex flex-col'>
        <div className="w-full h-auto flex justify-center items-center gap-4 py-4">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`px-4 py-2 rounded-lg ${selectedButton === button.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setSelectedButton(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          {renderContent()}
        </div>
      </main>
    </section>
  );
};

export { CollectionPage };

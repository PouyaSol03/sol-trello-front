import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContentPage } from '../contentPage/ContentPage';
import { Gallery } from '../Gallery';

const collectionsContent = {
  "گرویتی": "Content for گرویتی",
  "سعیدی": "Content for سعیدی",
  "آرش": "Content for آرش",
  "فلاورز": "Content for فلاورز",
  "سوخاریس": "Content for سوخاریس",
  "کوچینی": "Content for کوچینی",
  "کافه یو": "Content for کافه یو",
  "دییر": "Content for دییر",
  "چه جگری": "Content for چه جگری",
  "سالار": "Content for سالار",
  "کوه‌سر": "Content for کوه‌سر",
  "سرای حمید": "Content for سرای حمید",
  "نارمک": "Content for نارمک",
  "شهرما": "Content for شهرما",
  "بونیتو": "Content for بونیتو",
  "چای احمد": "Content for چای احمد",
  "راشسا": "Content for راشسا"
};

const CollectionPage = () => {
  const { collectionName } = useParams();
  const content = collectionsContent[collectionName] || "Content not found";

  const [selectedButton, setSelectedButton] = useState(null);

  const buttons = [
    { id: 1, label: 'محتوا اختصاصی' },
    { id: 2, label: 'گالری' },
    { id: 3, label: 'موجودی محتوا' },
    { id: 4, label: 'مشخصات مجموعه' }
  ];

  const renderContent = () => {
    switch (selectedButton) {
      case 1:
        return <ContentPage content={content} />;
      case 2:
        return <Gallery content={content} />;
      // case 3:
      //   return <ContentPage3 content={content} />;
      // case 4:
      //   return <ContentPage4 content={content} />;
      default:
        return null;
    }
  };

  return (
    <section className='w-screen h-screen flex justify-center items-center p-3 bg-slate-200 gap-2'>
      <aside className='w-1/6 h-full bg-white rounded-lg p-4'>
        <h2 className='w-full text-center font-bold'>منوی اختصاصی</h2>
      </aside>
      <main className='w-full h-full bg-white rounded-lg'>
        <div className="w-full h-20 flex justify-center items-center gap-4">
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
        <div className="w-full h-full p-4 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </section>
  );
};

export { CollectionPage };

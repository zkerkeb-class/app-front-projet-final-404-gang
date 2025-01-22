import React from 'react';

const HorizontalList = ({ items, renderItem }) => {
  console.log('HorizontalList items:', items);
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {items.map((item, index) => {
        console.log('Rendering item:', item);
        return renderItem(item, index);
      })}
    </div>
  );
};

export default HorizontalList; 
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const HorizontalList = ({ items }) => {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    horizontal: true,
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-x-auto whitespace-nowrap"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        style={{
          width: `${rowVirtualizer.getTotalSize()}px`,
          height: "200px",
          position: "relative"
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="inline-block mr-4"
            style={{
              position: "absolute",
              left: 0,
              width: "180px",
              transform: `translateX(${virtualItem.start}px)`,
            }}
          >
            {/* Card content */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={items[virtualItem.index]?.image || 'placeholder.jpg'}
                alt={items[virtualItem.index]?.title || 'Item'}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold truncate">
                  {items[virtualItem.index]?.title || 'Title'}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalList; 
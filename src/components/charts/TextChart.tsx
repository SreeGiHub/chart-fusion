
import React, { useState, useRef, useEffect } from 'react';
import { ChartItemType } from '@/types';
import TextareaAutosize from 'react-textarea-autosize';
import { useDashboard } from '@/context/DashboardContext';

interface TextChartProps {
  item: ChartItemType;
  isSelected: boolean;
}

const TextChart: React.FC<TextChartProps> = ({ item, isSelected }) => {
  const { dispatch } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(item.size.height);

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      if (contentHeight > height) {
        setHeight(contentHeight + 40);
        dispatch({
          type: "UPDATE_ITEM",
          payload: {
            id: item.id,
            updates: {
              size: {
                width: item.size.width,
                height: contentHeight + 40,
              },
            },
          },
        });
      }
    }
  }, [item, dispatch, height]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="h-full w-full p-4 overflow-auto" ref={contentRef} onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <TextareaAutosize
          value={item.data.datasets[0]?.label || ""}
          className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
          onChange={(e) => {
            dispatch({
              type: "UPDATE_ITEM",
              payload: {
                id: item.id,
                updates: {
                  data: {
                    ...item.data,
                    datasets: [
                      {
                        ...item.data.datasets[0],
                        label: e.target.value,
                      },
                    ],
                  },
                },
              },
            });
          }}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <div className="prose max-w-none">
          {item.data.datasets[0]?.label || ""}
        </div>
      )}
    </div>
  );
};

export default TextChart;

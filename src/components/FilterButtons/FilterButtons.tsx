import React from 'react';
import clsx from 'clsx';
import { AudioFileIcon, DraftIcon, ImageIcon, PdfFileIcon, VideoFileIcon } from '../icons';

interface FilterButtonsProps {
    onFilterChange: (filterType: string) => void;
    selectedFilters: string[];
}

const filterColors: Record<string, { bgColor: string }> = {
    document: { bgColor: '#4285F4' },
    pdf: { bgColor: '#EA4335' },
    image: { bgColor: '#FBBC05' },
    audio: { bgColor: '#FF6D00' },
    video: { bgColor: '#34A853' },
};

const filterTypes = [
    { type: 'document', label: 'Docs', icon: DraftIcon },
    { type: 'pdf', label: 'PDF', icon: PdfFileIcon },
    { type: 'image', label: 'Images', icon: ImageIcon },
    { type: 'audio', label: 'MP3/Audio', icon: AudioFileIcon },
    { type: 'video', label: 'MP4/Video', icon: VideoFileIcon },
];
export const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilterChange, selectedFilters }) => {
    return (
        <div className={clsx(
            'flex items-center justify-center gap-5 mt-3 mb-6',
        )}>
            {filterTypes.map((filter) => {
                const IconComponent = filter.icon;
                const isSelected = selectedFilters.includes(filter.type);
                const { bgColor } = filterColors[filter.type];
                return (
                    <button
                        key={filter.type}
                        onClick={() => onFilterChange(filter.type)}
                        className={clsx(
                            'flex items-center space-x-1  rounded-2xl px-3 py-1.5',
                            isSelected
                                ? `bg-gray`
                                : 'bg-white text-black border-gray-300'
                        )}
                        style={{
                            color: isSelected ? bgColor : 'black',
                            borderColor: isSelected ? bgColor : '#E0E0E0',
                            boxShadow: isSelected ? `2px 2px 8px ${bgColor}` : "2px 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <IconComponent fill={bgColor} />
                        <span>{filter.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

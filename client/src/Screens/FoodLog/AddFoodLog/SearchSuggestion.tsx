import React from 'react';

interface SearchSuggestionProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
}

const SearchSuggestion: React.FC<SearchSuggestionProps> = ({ name, imageUrl, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
      )}
      <span style={{ fontSize: '0.95rem' }}>{name}</span>
    </div>
  );
};

export default SearchSuggestion;

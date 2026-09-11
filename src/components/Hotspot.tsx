import React from 'react';

interface HotspotProps {
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  activeStyle?: 'border' | 'fill' | 'ring';
  rounded?: 'full' | 'lg' | 'md';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Hotspot: React.FC<HotspotProps> = ({
  top,
  left,
  width,
  height,
  label,
  onClick,
  active = false,
  activeStyle = 'border',
  rounded = 'full',
  disabled = false,
  className = '',
  children,
}) => {
  const roundedClass = `rounded-${rounded}`;
  const activeClass = active ? `active active-${activeStyle}` : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      role="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        top,
        left,
        width,
        height,
      }}
      className={`hotspot-btn ${roundedClass} ${activeClass} ${className}`}
    >
      {children}
    </button>
  );
};

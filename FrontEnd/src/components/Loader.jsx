import { memo } from 'react';

const Loader = memo(
  ({
    variant = 'spinner',
    size = 'md',
    color = 'blue',
    text = '',
    overlay = false,
    className = '',
  }) => {
    // Size configurations
    const sizeConfig = {
      sm: { spinner: 'w-6 h-6', text: 'text-sm', gap: 'gap-2' },
      md: { spinner: 'w-8 h-8', text: 'text-base', gap: 'gap-3' },
      lg: { spinner: 'w-12 h-12', text: 'text-lg', gap: 'gap-4' },
      xl: { spinner: 'w-16 h-16', text: 'text-xl', gap: 'gap-5' },
    };

    // Color configurations
    const colorConfig = {
      blue: {
        primary: 'border-blue-500 text-blue-500',
        secondary: 'border-blue-200',
        accent: 'bg-blue-500',
        dots: 'bg-blue-500',
      },
      gray: {
        primary: 'border-gray-500 text-gray-500',
        secondary: 'border-gray-200',
        accent: 'bg-gray-500',
        dots: 'bg-gray-500',
      },
      green: {
        primary: 'border-green-500 text-green-500',
        secondary: 'border-green-200',
        accent: 'bg-green-500',
        dots: 'bg-green-500',
      },
      purple: {
        primary: 'border-purple-500 text-purple-500',
        secondary: 'border-purple-200',
        accent: 'bg-purple-500',
        dots: 'bg-purple-500',
      },
    };

    const currentSize = sizeConfig[size];
    const currentColor = colorConfig[color];

    // Spinner Loader
    const SpinnerLoader = () => (
      <div
        className={`
        ${currentSize.spinner}
        border-4
        ${currentColor.secondary}
        border-t-transparent
        border-solid
        rounded-full
        animate-spin
      `}
        style={{
          borderTopColor: currentColor.primary.includes('blue')
            ? '#3B82F6'
            : currentColor.primary.includes('gray')
            ? '#6B7280'
            : currentColor.primary.includes('green')
            ? '#10B981'
            : '#8B5CF6',
        }}
      />
    );

    // Dots Loader
    const DotsLoader = () => (
      <div className="flex space-x-2">
        {[0, 1, 2].map(index => (
          <div
            key={index}
            className={`
            ${
              size === 'sm'
                ? 'w-2 h-2'
                : size === 'md'
                ? 'w-3 h-3'
                : size === 'lg'
                ? 'w-4 h-4'
                : 'w-5 h-5'
            }
            ${currentColor.dots}
            rounded-full
            animate-bounce
          `}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    );

    // Pulse Loader
    const PulseLoader = () => (
      <div className="relative">
        <div
          className={`
          ${currentSize.spinner}
          ${currentColor.accent}
          rounded-full
          animate-ping
          absolute
          opacity-75
        `}
        />
        <div
          className={`
          ${currentSize.spinner}
          ${currentColor.accent}
          rounded-full
          animate-pulse
        `}
        />
      </div>
    );

    // Bars Loader
    const BarsLoader = () => (
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3].map(index => (
          <div
            key={index}
            className={`
            ${size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-3'}
            ${currentColor.accent}
            rounded-sm
            animate-pulse
          `}
            style={{
              height: `${12 + (index % 2) * 8}px`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.2s',
            }}
          />
        ))}
      </div>
    );

    // Render appropriate loader variant
    const renderLoader = () => {
      switch (variant) {
        case 'dots':
          return <DotsLoader />;
        case 'pulse':
          return <PulseLoader />;
        case 'bars':
          return <BarsLoader />;
        default:
          return <SpinnerLoader />;
      }
    };

    // Container classes
    const containerClasses = `
    flex
    flex-col
    items-center
    justify-center
    ${currentSize.gap}
    ${overlay ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : 'h-full w-full'}
    ${className}
  `;

    return (
      <div className={containerClasses}>
        {/* Loader Animation */}
        <div className="flex items-center justify-center">{renderLoader()}</div>

        {/* Loading Text */}
        {text && (
          <div className={`${currentSize.text} ${currentColor.primary} font-medium animate-pulse`}>
            {text}
          </div>
        )}
      </div>
    );
  }
);

// Display name for debugging
Loader.displayName = 'Loader';

export default Loader;

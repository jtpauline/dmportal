import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-lg p-4';
  
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md hover:shadow-lg transition-shadow',
    bordered: 'bg-white border-2 border-gray-200'
  };

  const cardClasses = clsx(
    baseStyles,
    variantStyles[variant],
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;

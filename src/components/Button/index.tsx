import React, { ButtonHTMLAttributes, memo } from 'react';
import cn from 'classnames';
import './styles.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
};

/**
 * Button UI component
 */
export const Button = memo(({ text, disabled, className, onClick, ...otherProps }: ButtonProps) => {
  const buttonClassname: string = cn(
    'button',
    {
      button__disabled: disabled,
    },
    className,
  );

  return (
    <button
      type="button"
      className={buttonClassname}
      disabled={disabled}
      onClick={onClick}
      {...otherProps}
    >
      {text}
    </button>
  );
});

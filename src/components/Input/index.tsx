import React, { ChangeEvent, InputHTMLAttributes, memo, useCallback } from 'react';
import './styles.css';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label?: string;
  onChange: (text: string) => void;
};

/**
 * Input UI component
 */
export const Input = memo(({ name, label, onChange, ...inputProps }: InputProps) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <span className="input_wrapper">
      {!!label && (
        <label htmlFor={name} className="input_label">
          {label}:
        </label>
      )}
      <input className="input" name={name} onChange={handleInputChange} {...inputProps} />
    </span>
  );
});

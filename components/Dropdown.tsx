interface Props {
  className?: string;
  name?: string;
  value: string;
  options: string[];
  disabled?: boolean;
  includeEmptyOption?: boolean;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<Props> = ({
  className,
  name,
  value,
  options,
  disabled,
  includeEmptyOption = false,
  onChange,
}) => {
  return (
    <select
      className={`bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-3 text-center inline-flex items-center ${className}`}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {includeEmptyOption && <option value="" key="empty-option"></option>}
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

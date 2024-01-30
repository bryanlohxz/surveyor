interface Props {
  className?: string;
  name?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Dropdown: React.FC<Props> = ({
  className,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <select
      className={`ml-4 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-3 text-center inline-flex items-center ${className}`}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

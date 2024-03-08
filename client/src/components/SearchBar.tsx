type SearchProps = {
  searchInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ searchInput, onChange }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search.."
      value={searchInput}
      onChange={onChange}
    />
  );
}

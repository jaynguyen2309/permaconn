type SearchProps = {
  searchInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ searchInput, onChange }: SearchProps) {
  return (
    <input
      style={{ marginRight: "10px", marginBottom: "10px" }}
      type="text"
      placeholder="Search.."
      value={searchInput}
      onChange={onChange}
    />
  );
}

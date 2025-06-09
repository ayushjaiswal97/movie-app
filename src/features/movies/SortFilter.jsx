const SortFilter = ({ sort, setSort }) => {
  return (
    <div className="flex justify-center mb-4 gap-2">
      <label className="text-sm font-medium">Sort by:</label>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-1 rounded bg-white dark:bg-gray-800 dark:text-white"
      >
        <option value="">Default</option>
        <option value="rating">Rating (High → Low)</option>
        <option value="latest">Latest Release</option>
      </select>
    </div>
  );
};

export default SortFilter;

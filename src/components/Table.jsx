const Table = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-base-200">
      <table className="table w-full text-base text-base-content">
        <thead className="bg-base-200">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-6 py-3 text-left font-body font-semibold text-neutral uppercase tracking-wider"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-base-100"}
            >
              {headers.map((header) => (
                <td key={header.key} className="px-6 py-4 whitespace-nowrap font-body text-base-content">
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

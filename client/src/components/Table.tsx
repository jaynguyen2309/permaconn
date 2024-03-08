type TableProps = {
  columns: Columns[];
  data: any[];
};

export type Columns = {
  title: string;
  dataIndex: string;
  render?: (column: any, row: any, rowIndex: number) => React.ReactNode;
};

export default function Table({ columns, data }: TableProps) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`table-header-${index}`}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`table-row-${rowIndex}`}>
            {columns.map((column, colIndex) => (
              <td key={`table-cell-${rowIndex}-${colIndex}`} role="cell">
                {column.render
                  ? column.render(column, row, rowIndex)
                  : row[column.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

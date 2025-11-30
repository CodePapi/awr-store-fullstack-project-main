import type { AdminProductTableProps } from '../types';

const AdminProductTable: React.FC<AdminProductTableProps> = ({
  products,
}: AdminProductTableProps) => {
  if (products.length === 0) {
    return (
      <p>
        No products found in the database. Use the "Create New Product" button
        to add one.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Available</th>
            <th style={{ padding: '10px' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', width: '50px' }}>{product.id}</td>
              <td style={{ padding: '10px' }}>{product.name}</td>
              <td style={{ padding: '10px' }}>{product.price.toFixed(2)}EUR</td>
              <td style={{ padding: '10px' }}>{product.availableCount}</td>
              <td style={{ padding: '10px', fontSize: 'small' }}>
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductTable;

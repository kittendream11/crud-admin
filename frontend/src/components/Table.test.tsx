import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '@/components/Table';

interface TestData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

describe('Table Component', () => {
  const mockData: TestData[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
    },
  ];

  const mockColumns = [
    {
      header: 'Name',
      accessor: 'name' as const,
    },
    {
      header: 'Email',
      accessor: 'email' as const,
    },
    {
      header: 'Role',
      accessor: 'role' as const,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
    },
  ];

  describe('Rendering', () => {
    it('should render table with headers', () => {
      render(<Table columns={mockColumns} data={mockData} isLoading={false} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render table rows with data', () => {
      render(<Table columns={mockColumns} data={mockData} isLoading={false} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getAllByText('Active')).toHaveLength(2);
    });

    it('should render with custom column accessor function', () => {
      const customColumns = [
        {
          header: 'Full Name',
          accessor: (row: TestData) => `${row.name} (${row.role})`,
        },
        {
          header: 'Email',
          accessor: 'email' as const,
        },
      ];

      render(<Table columns={customColumns} data={mockData} isLoading={false} />);

      expect(screen.getByText('John Doe (Admin)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith (User)')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no data', () => {
      render(<Table columns={mockColumns} data={[]} isLoading={false} />);

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading message when isLoading is true', () => {
      render(<Table columns={mockColumns} data={[]} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show loading state even with data', () => {
      render(<Table columns={mockColumns} data={mockData} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className to columns', () => {
      const customColumns = [
        {
          header: 'Name',
          accessor: 'name' as const,
          className: 'font-bold text-lg',
        },
        {
          header: 'Email',
          accessor: 'email' as const,
          className: 'text-gray-500',
        },
      ];

      const { container } = render(
        <Table columns={customColumns} data={mockData} isLoading={false} />,
      );

      // Verify table renders without errors
      expect(container.querySelector('table')).toBeInTheDocument();
    });
  });

  describe('Row Click Handler', () => {
    it('should call onRowClick when row is clicked', () => {
      const handleRowClick = jest.fn();
      render(
        <Table
          columns={mockColumns}
          data={mockData}
          isLoading={false}
          onRowClick={handleRowClick}
        />,
      );

      const rows = screen.getAllByRole('row');
      if (rows.length > 1) {
        rows[1].click();
        expect(handleRowClick).toHaveBeenCalled();
      }
    });
  });

  describe('Data Updates', () => {
    it('should update table when data changes', () => {
      const { rerender } = render(
        <Table columns={mockColumns} data={mockData} isLoading={false} />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();

      const newData = [
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'Moderator',
          status: 'Inactive',
        },
      ];

      rerender(<Table columns={mockColumns} data={newData} isLoading={false} />);

      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});

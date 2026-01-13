import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-500');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-500');
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-2', 'py-1', 'text-sm');
    });

    it('should render medium size', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should handle loading state', () => {
      render(<Button disabled>Loading...</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Click Events', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Type prop', () => {
    it('should render as submit button', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render as reset button', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('should render as button by default', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role', () => {
      render(<Button>Accessible</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toBeInTheDocument();
    });
  });
});

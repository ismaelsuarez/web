import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';

// Mock the cart store
const mockAddToCart = vi.fn();
vi.mock('../stores/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addToCart: mockAddToCart,
    getItemCount: vi.fn(() => 0),
  })),
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  brand: 'Test Brand',
  createdAt: '2023-01-01T00:00:00Z',
  category: { id: 1, name: 'Electronics', slug: 'electronics' },
  variants: [
    {
      id: 1,
      sku: 'TEST-001',
      price: 1000,
      stock: 10,
      images: ['https://via.placeholder.com/300'],
      specs: { color: 'red', size: 'M' },
    },
    {
      id: 2,
      sku: 'TEST-002',
      price: 1200,
      stock: 5,
      images: ['https://via.placeholder.com/300'],
      specs: { color: 'blue', size: 'L' },
    },
  ],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
  });

  it('should display product image', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('should display lowest price when multiple variants', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    // Should show the lowest price (1000)
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
    expect(screen.queryByText('$ 1.200,00')).not.toBeInTheDocument();
  });

  it('should display lowest stock when multiple variants', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    // Should show the lowest stock (5)
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    expect(screen.queryByText('Stock: 10')).not.toBeInTheDocument();
  });

  it('should have link to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/productos/1');
  });

  it('should show "Ver detalles" button', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Ver detalles')).toBeInTheDocument();
  });

  it('should show "Agregar al carrito" button', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  it('should call addToCart when "Agregar al carrito" is clicked', async () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const addToCartButton = screen.getByText('Agregar al carrito');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, mockProduct.variants[0]);
    });
  });

  it('should disable add to cart button when stock is 0', () => {
    const productWithNoStock = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          stock: 0,
        },
      ],
    };

    renderWithRouter(<ProductCard product={productWithNoStock} onAddToCart={mockAddToCart} />);

    const addToCartButton = screen.getByText('Sin stock');
    expect(addToCartButton).toBeDisabled();
  });

  it('should show "Sin stock" when stock is 0', () => {
    const productWithNoStock = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          stock: 0,
        },
      ],
    };

    renderWithRouter(<ProductCard product={productWithNoStock} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });

  it('should handle product without description', () => {
    const productWithoutDescription = {
      ...mockProduct,
      description: undefined,
    };

    renderWithRouter(<ProductCard product={productWithoutDescription} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  it('should handle product without images', () => {
    const productWithoutImages = {
      ...mockProduct,
      variants: [
        {
          ...mockProduct.variants[0],
          images: [],
        },
      ],
    };

    renderWithRouter(<ProductCard product={productWithoutImages} onAddToCart={mockAddToCart} />);

    // Should show a placeholder or default image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should display category information', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Product');

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/productos/1');
  });
});

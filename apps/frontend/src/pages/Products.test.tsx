import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Products } from './Products';

// Mock the API
vi.mock('../lib/api', () => ({
  productsApi: {
    getProducts: vi.fn(),
  },
}));

// Mock the cart store
vi.mock('../stores/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addToCart: vi.fn(),
    getItemCount: vi.fn(() => 0),
  })),
}));

const mockProducts = {
  products: [
    {
      id: 1,
      title: 'Test Product 1',
      slug: 'test-product-1',
      description: 'Test description 1',
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
      ],
    },
    {
      id: 2,
      title: 'Test Product 2',
      slug: 'test-product-2',
      description: 'Test description 2',
      brand: 'Test Brand',
      createdAt: '2023-01-02T00:00:00Z',
      category: { id: 2, name: 'Clothing', slug: 'clothing' },
      variants: [
        {
          id: 2,
          sku: 'TEST-002',
          price: 2000,
          stock: 5,
          images: ['https://via.placeholder.com/300'],
          specs: { color: 'blue', size: 'L' },
        },
      ],
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    pages: 1,
  },
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Products Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render products list', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Products />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Check if product cards are rendered
    expect(screen.getByText('$ 1.000,00')).toBeInTheDocument();
    expect(screen.getByText('$ 2.000,00')).toBeInTheDocument();
    expect(screen.getAllByText('Test Brand')).toHaveLength(2);
  });

  it('should display loading state initially', () => {
    renderWithProviders(<Products />);

    // Check for loading indicators
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  it('should display empty state when no products', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue({
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    });

    renderWithProviders(<Products />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    });
  });

  it('should display search input', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Products />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
    });
  });

  it('should display category filter', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Categorías:')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockRejectedValue(new Error('API Error'));

    renderWithProviders(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los productos')).toBeInTheDocument();
    });
  });

  it('should display product images', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Products />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2); // Two products
      expect(images[0]).toHaveAttribute('src', 'https://via.placeholder.com/300');
    });
  });

  it('should display stock information', async () => {
    const { productsApi } = await import('../lib/api');
    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    renderWithProviders(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Stock: 10')).toBeInTheDocument();
      expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    });
  });
});

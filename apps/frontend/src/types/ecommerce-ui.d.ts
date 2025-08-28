declare module '@ecommerce/ui' {
  import { ReactNode } from 'react';

  export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: string;
  }

  export interface CardProps {
    children: ReactNode;
    className?: string;
  }

  export interface ProductCardProps {
    product: any;
    onAddToCart: (product: any, variant: any) => void;
  }

  export interface CartDrawerProps {
    isOpen: boolean;
    items: any[];
    onClose: () => void;
    onRemoveItem: (variantId: number) => void;
    onUpdateQuantity: (variantId: number, quantity: number) => void;
    onClearCart: () => void;
    total: number;
    itemCount: number;
    onCheckout: () => void;
  }

  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
  export const ProductCard: React.FC<ProductCardProps>;
  export const CartDrawer: React.FC<CartDrawerProps>;
}

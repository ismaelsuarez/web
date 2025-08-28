import { Test, TestingModule } from '@nestjs/testing';
import { ShippingService } from './shipping.service';

describe('ShippingService', () => {
  let service: ShippingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingService],
    }).compile();

    service = module.get<ShippingService>(ShippingService);
  });

  describe('calculateShippingCost', () => {
    it('should calculate shipping cost for Buenos Aires with 2kg', () => {
      const cost = service.calculateShippingCost('Buenos Aires', 2);
      expect(cost).toBe(800); // 1-3kg range
    });

    it('should calculate shipping cost for Córdoba with 5kg', () => {
      const cost = service.calculateShippingCost('Córdoba', 5);
      expect(cost).toBe(1800); // 5-10kg range
    });

    it('should calculate shipping cost for Mendoza with 0.5kg', () => {
      const cost = service.calculateShippingCost('Mendoza', 0.5);
      expect(cost).toBe(1000); // 0-1kg range
    });

    it('should calculate shipping cost for Tucumán with 15kg', () => {
      const cost = service.calculateShippingCost('Tucumán', 15);
      expect(cost).toBe(4500); // 10+kg range
    });

    it('should throw error for non-existent province', () => {
      expect(() => {
        service.calculateShippingCost('Provincia Inexistente', 1);
      }).toThrow('Provincia no encontrada: Provincia Inexistente');
    });

    it('should throw error for zero weight', () => {
      expect(() => {
        service.calculateShippingCost('Buenos Aires', 0);
      }).toThrow('El peso debe ser mayor a 0');
    });

    it('should throw error for negative weight', () => {
      expect(() => {
        service.calculateShippingCost('Buenos Aires', -1);
      }).toThrow('El peso debe ser mayor a 0');
    });

    it('should handle case-insensitive province names', () => {
      const cost1 = service.calculateShippingCost('BUENOS AIRES', 1);
      const cost2 = service.calculateShippingCost('buenos aires', 1);
      const cost3 = service.calculateShippingCost('Buenos Aires', 1);
      
      expect(cost1).toBe(cost2);
      expect(cost2).toBe(cost3);
      expect(cost1).toBe(500); // 0-1kg range
    });
  });

  describe('getProvinces', () => {
    it('should return all available provinces', () => {
      const provinces = service.getProvinces();
      
      expect(provinces).toContain('Buenos Aires');
      expect(provinces).toContain('Córdoba');
      expect(provinces).toContain('Santa Fe');
      expect(provinces).toContain('Mendoza');
      expect(provinces).toContain('Tucumán');
      expect(provinces).toContain('Salta');
      expect(provinces).toContain('Entre Ríos');
      expect(provinces).toContain('Chaco');
      expect(provinces).toContain('Corrientes');
      expect(provinces).toContain('Misiones');
      
      expect(provinces).toHaveLength(10);
    });
  });

  describe('getShippingRates', () => {
    it('should return all shipping rates with weight ranges', () => {
      const rates = service.getShippingRates();
      
      expect(rates).toHaveLength(10);
      
      // Check Buenos Aires rates
      const buenosAires = rates.find(rate => rate.province === 'Buenos Aires');
      expect(buenosAires).toBeDefined();
      expect(buenosAires?.weightRanges).toHaveLength(5);
      
      // Check weight ranges for Buenos Aires
      expect(buenosAires?.weightRanges[0]).toEqual({
        minWeight: 0,
        maxWeight: 1,
        cost: 500,
      });
      
      expect(buenosAires?.weightRanges[1]).toEqual({
        minWeight: 1,
        maxWeight: 3,
        cost: 800,
      });
      
      expect(buenosAires?.weightRanges[2]).toEqual({
        minWeight: 3,
        maxWeight: 5,
        cost: 1200,
      });
      
      expect(buenosAires?.weightRanges[3]).toEqual({
        minWeight: 5,
        maxWeight: 10,
        cost: 1800,
      });
      
      expect(buenosAires?.weightRanges[4]).toEqual({
        minWeight: 10,
        maxWeight: 999,
        cost: 2500,
      });
    });

    it('should have consistent weight ranges across all provinces', () => {
      const rates = service.getShippingRates();
      
      rates.forEach(rate => {
        expect(rate.weightRanges).toHaveLength(5);
        
        // Check weight range structure
        rate.weightRanges.forEach((range, index) => {
          expect(range).toHaveProperty('minWeight');
          expect(range).toHaveProperty('maxWeight');
          expect(range).toHaveProperty('cost');
          expect(range.minWeight).toBeGreaterThanOrEqual(0);
          expect(range.maxWeight).toBeGreaterThan(range.minWeight);
          expect(range.cost).toBeGreaterThan(0);
        });
        
        // Check weight range continuity
        for (let i = 0; i < rate.weightRanges.length - 1; i++) {
          const current = rate.weightRanges[i];
          const next = rate.weightRanges[i + 1];
          expect(next.minWeight).toBe(current.maxWeight);
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle weight at boundary values', () => {
      // Test exact boundary values
      expect(service.calculateShippingCost('Buenos Aires', 1)).toBe(500); // 0-1kg range
      expect(service.calculateShippingCost('Buenos Aires', 3)).toBe(800); // 1-3kg range
      expect(service.calculateShippingCost('Buenos Aires', 5)).toBe(1800); // 5-10kg range
      expect(service.calculateShippingCost('Buenos Aires', 10)).toBe(2500); // 10+kg range
    });

    it('should handle very large weights', () => {
      expect(service.calculateShippingCost('Buenos Aires', 1000)).toBe(2500); // Max range
      expect(service.calculateShippingCost('Misiones', 1000)).toBe(4800); // Max range
    });

    it('should handle decimal weights', () => {
      expect(service.calculateShippingCost('Buenos Aires', 0.1)).toBe(500); // 0-1kg range
      expect(service.calculateShippingCost('Buenos Aires', 2.5)).toBe(800); // 1-3kg range
      expect(service.calculateShippingCost('Buenos Aires', 7.8)).toBe(1800); // 5-10kg range
    });
  });
});

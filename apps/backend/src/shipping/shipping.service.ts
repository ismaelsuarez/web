import { Injectable } from '@nestjs/common';

export interface ShippingRate {
  province: string;
  weightRanges: {
    minWeight: number;
    maxWeight: number;
    cost: number;
  }[];
}

@Injectable()
export class ShippingService {
  private readonly shippingRates: ShippingRate[] = [
    {
      province: 'Buenos Aires',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 500 },
        { minWeight: 1, maxWeight: 3, cost: 800 },
        { minWeight: 3, maxWeight: 5, cost: 1200 },
        { minWeight: 5, maxWeight: 10, cost: 1800 },
        { minWeight: 10, maxWeight: 999, cost: 2500 },
      ],
    },
    {
      province: 'Córdoba',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 800 },
        { minWeight: 1, maxWeight: 3, cost: 1200 },
        { minWeight: 3, maxWeight: 5, cost: 1800 },
        { minWeight: 5, maxWeight: 10, cost: 2500 },
        { minWeight: 10, maxWeight: 999, cost: 3500 },
      ],
    },
    {
      province: 'Santa Fe',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 700 },
        { minWeight: 1, maxWeight: 3, cost: 1100 },
        { minWeight: 3, maxWeight: 5, cost: 1600 },
        { minWeight: 5, maxWeight: 10, cost: 2200 },
        { minWeight: 10, maxWeight: 999, cost: 3000 },
      ],
    },
    {
      province: 'Mendoza',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1000 },
        { minWeight: 1, maxWeight: 3, cost: 1500 },
        { minWeight: 3, maxWeight: 5, cost: 2200 },
        { minWeight: 5, maxWeight: 10, cost: 3000 },
        { minWeight: 10, maxWeight: 999, cost: 4000 },
      ],
    },
    {
      province: 'Tucumán',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1200 },
        { minWeight: 1, maxWeight: 3, cost: 1800 },
        { minWeight: 3, maxWeight: 5, cost: 2500 },
        { minWeight: 5, maxWeight: 10, cost: 3500 },
        { minWeight: 10, maxWeight: 999, cost: 4500 },
      ],
    },
    {
      province: 'Salta',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1300 },
        { minWeight: 1, maxWeight: 3, cost: 2000 },
        { minWeight: 3, maxWeight: 5, cost: 2800 },
        { minWeight: 5, maxWeight: 10, cost: 3800 },
        { minWeight: 10, maxWeight: 999, cost: 5000 },
      ],
    },
    {
      province: 'Entre Ríos',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 600 },
        { minWeight: 1, maxWeight: 3, cost: 1000 },
        { minWeight: 3, maxWeight: 5, cost: 1500 },
        { minWeight: 5, maxWeight: 10, cost: 2100 },
        { minWeight: 10, maxWeight: 999, cost: 2800 },
      ],
    },
    {
      province: 'Chaco',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1100 },
        { minWeight: 1, maxWeight: 3, cost: 1700 },
        { minWeight: 3, maxWeight: 5, cost: 2400 },
        { minWeight: 5, maxWeight: 10, cost: 3200 },
        { minWeight: 10, maxWeight: 999, cost: 4200 },
      ],
    },
    {
      province: 'Corrientes',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1000 },
        { minWeight: 1, maxWeight: 3, cost: 1600 },
        { minWeight: 3, maxWeight: 5, cost: 2300 },
        { minWeight: 5, maxWeight: 10, cost: 3100 },
        { minWeight: 10, maxWeight: 999, cost: 4100 },
      ],
    },
    {
      province: 'Misiones',
      weightRanges: [
        { minWeight: 0, maxWeight: 1, cost: 1200 },
        { minWeight: 1, maxWeight: 3, cost: 1900 },
        { minWeight: 3, maxWeight: 5, cost: 2600 },
        { minWeight: 5, maxWeight: 10, cost: 3600 },
        { minWeight: 10, maxWeight: 999, cost: 4800 },
      ],
    },
  ];

  calculateShippingCost(province: string, weight: number): number {
    const provinceRate = this.shippingRates.find(
      (rate) => rate.province.toLowerCase() === province.toLowerCase()
    );

    if (!provinceRate) {
      throw new Error(`Provincia no encontrada: ${province}`);
    }

    if (weight <= 0) {
      throw new Error('El peso debe ser mayor a 0');
    }

    const weightRange = provinceRate.weightRanges.find(
      (range) => weight > range.minWeight && weight <= range.maxWeight
    );

    if (!weightRange) {
      throw new Error(`No se encontró tarifa para el peso: ${weight}kg`);
    }

    return weightRange.cost;
  }

  getProvinces(): string[] {
    return this.shippingRates.map((rate) => rate.province);
  }

  getShippingRates(): ShippingRate[] {
    return this.shippingRates;
  }
}

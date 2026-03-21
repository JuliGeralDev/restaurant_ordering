import { Money } from '@/domain/value-objects/money.vo';
import { ValidationError } from '@/domain/errors/validation.error';

describe('Money Value Object', () => {
  describe('constructor', () => {
    it('should create Money with valid integer amount', () => {
      const money = new Money(1000);
      expect(money.value).toBe(1000);
    });

    it('should create Money with zero amount', () => {
      const money = new Money(0);
      expect(money.value).toBe(0);
    });

    it('should throw ValidationError for non-integer amount', () => {
      expect(() => new Money(10.5)).toThrow(ValidationError);
      expect(() => new Money(10.5)).toThrow('Money amount must be an integer (cents)');
    });

    it('should throw ValidationError for negative amount', () => {
      expect(() => new Money(-100)).toThrow(ValidationError);
      expect(() => new Money(-100)).toThrow('Money amount cannot be negative');
    });
  });

  describe('add', () => {
    it('should add two Money values correctly', () => {
      const money1 = new Money(1000);
      const money2 = new Money(500);
      const result = money1.add(money2);
      
      expect(result.value).toBe(1500);
    });

    it('should add zero without changing value', () => {
      const money = new Money(1000);
      const zero = new Money(0);
      const result = money.add(zero);
      
      expect(result.value).toBe(1000);
    });
  });

  describe('multiply', () => {
    it('should multiply Money by positive integer', () => {
      const money = new Money(1000);
      const result = money.multiply(3);
      
      expect(result.value).toBe(3000);
    });

    it('should multiply by zero', () => {
      const money = new Money(1000);
      const result = money.multiply(0);
      
      expect(result.value).toBe(0);
    });

    it('should throw ValidationError for non-integer quantity', () => {
      const money = new Money(1000);
      expect(() => money.multiply(2.5)).toThrow(ValidationError);
    });

    it('should throw ValidationError for negative quantity', () => {
      const money = new Money(1000);
      expect(() => money.multiply(-2)).toThrow(ValidationError);
    });
  });

  describe('equals', () => {
    it('should return true for equal Money values', () => {
      const money1 = new Money(1000);
      const money2 = new Money(1000);
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different Money values', () => {
      const money1 = new Money(1000);
      const money2 = new Money(500);
      
      expect(money1.equals(money2)).toBe(false);
    });
  });
});

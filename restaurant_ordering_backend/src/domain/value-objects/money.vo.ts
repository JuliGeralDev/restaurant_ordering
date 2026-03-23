import { ValidationError } from '@/domain/errors/validation.error';

export class Money {
    private readonly amount: number; // stored in minor units (for COP, centavos)

    constructor(amount: number) {
        if (!Number.isInteger(amount)) {
            throw new ValidationError('Money amount must be an integer in minor units');
        }

        if (amount < 0) {
            throw new ValidationError('Money amount cannot be negative');
        }

        this.amount = amount;
    }

    public get value(): number {
        return this.amount;
    }

    public add(other: Money): Money {
        return new Money(this.amount + other.value);
    }

    public multiply(quantity: number): Money {
        if (!Number.isInteger(quantity) || quantity < 0) {
            throw new ValidationError('Quantity must be a positive integer');
        }

        return new Money(this.amount * quantity);
    }

    public equals(other: Money): boolean {
        return this.amount === other.value;
    }
}

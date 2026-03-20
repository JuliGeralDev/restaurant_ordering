export class Money {
    private readonly amount: number; // in cents

    constructor(amount: number) {
        if (!Number.isInteger(amount)) {
            throw new Error('Money amount must be an integer (cents)');
        }

        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
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
            throw new Error('Quantity must be a positive integer');
        }

        return new Money(this.amount * quantity);
    }

    public equals(other: Money): boolean {
        return this.amount === other.value;
    }
}
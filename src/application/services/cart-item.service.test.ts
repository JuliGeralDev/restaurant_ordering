import { CartItemService } from './cart-item.service';
import { MenuRepository } from '@/domain/repositories/menu.repository';
import { ModifierSelectionService } from '@/domain/services/modifier-selection.service';
import { NotFoundError } from '@/domain/errors/not-found.error';
import { Money } from '@/domain/value-objects/money.vo';

describe('CartItemService', () => {
  let cartItemService: CartItemService;
  let mockMenuRepository: jest.Mocked<MenuRepository>;
  let mockModifierSelectionService: jest.Mocked<ModifierSelectionService>;

  beforeEach(() => {
    mockMenuRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<MenuRepository>;

    mockModifierSelectionService = {
      resolve: jest.fn(),
    } as unknown as jest.Mocked<ModifierSelectionService>;

    cartItemService = new CartItemService(
      mockMenuRepository,
      mockModifierSelectionService
    );
  });

  describe('resolveProductWithModifiers', () => {
    it('should resolve simple product without modifiers', async () => {
      const mockProduct = {
        productId: 'prod-1',
        name: 'Hamburguesa Clásica',
        basePrice: 1200,
        category: 'burgers',
      };

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      const result = await cartItemService.resolveProductWithModifiers('prod-1', 2);

      expect(result).toEqual({
        productId: 'prod-1',
        name: 'Hamburguesa Clásica',
        basePrice: new Money(1200),
        quantity: 2,
        modifiers: [],
      });

      expect(mockMenuRepository.findById).toHaveBeenCalledWith('prod-1');
      expect(mockModifierSelectionService.resolve).toHaveBeenCalledWith(mockProduct, undefined);
    });

    it('should resolve product with modifiers', async () => {
      const mockProduct = {
        productId: 'prod-8',
        name: 'Pizza Personalizada',
        basePrice: 1800,
        category: 'pizzas',
        modifiers: {
          size: {
            required: true,
            max: 1,
            options: {
              small: { name: 'Pequeña', price: 0 },
              large: { name: 'Grande', price: 400 },
            },
          },
        },
      };

      const modifiersInput = [
        { groupId: 'size', optionId: 'large', name: 'Grande', price: 400 },
      ];

      const resolvedModifiers = [
        {
          groupId: 'size',
          optionId: 'large',
          name: 'Grande',
          price: new Money(400),
        },
      ];

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue(resolvedModifiers);

      const result = await cartItemService.resolveProductWithModifiers(
        'prod-8',
        1,
        modifiersInput
      );

      expect(result).toEqual({
        productId: 'prod-8',
        name: 'Pizza Personalizada',
        basePrice: new Money(1800),
        quantity: 1,
        modifiers: resolvedModifiers,
      });

      expect(mockMenuRepository.findById).toHaveBeenCalledWith('prod-8');
      expect(mockModifierSelectionService.resolve).toHaveBeenCalledWith(
        mockProduct,
        modifiersInput
      );
    });

    it('should throw NotFoundError when product does not exist', async () => {
      mockMenuRepository.findById.mockResolvedValue(null);

      await expect(
        cartItemService.resolveProductWithModifiers('invalid-id', 1)
      ).rejects.toThrow(NotFoundError);

      await expect(
        cartItemService.resolveProductWithModifiers('invalid-id', 1)
      ).rejects.toThrow('Product not found');
    });

    it('should handle quantity correctly', async () => {
      const mockProduct = {
        productId: 'prod-2',
        name: 'Papas Fritas',
        basePrice: 500,
        category: 'sides',
      };

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      const result = await cartItemService.resolveProductWithModifiers('prod-2', 5);

      expect(result.quantity).toBe(5);
    });

    it('should create Money object with correct basePrice', async () => {
      const mockProduct = {
        productId: 'prod-3',
        name: 'Coca Cola',
        basePrice: 350,
        category: 'drinks',
      };

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      const result = await cartItemService.resolveProductWithModifiers('prod-3', 1);

      expect(result.basePrice).toBeInstanceOf(Money);
      expect(result.basePrice.value).toBe(350);
    });

    it('should pass modifiers to modifierSelectionService correctly', async () => {
      const mockProduct = {
        productId: 'prod-9',
        name: 'Ensalada Build-Your-Own',
        basePrice: 1200,
        category: 'salads',
      };

      const modifiersInput = [
        { groupId: 'protein', optionId: 'chicken', name: 'Pollo', price: 200 },
        { groupId: 'dressing', optionId: 'ranch', name: 'Ranch', price: 0 },
      ];

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      await cartItemService.resolveProductWithModifiers('prod-9', 1, modifiersInput);

      expect(mockModifierSelectionService.resolve).toHaveBeenCalledWith(
        mockProduct,
        modifiersInput
      );
    });

    it('should handle product with zero price', async () => {
      const mockProduct = {
        productId: 'prod-free',
        name: 'Agua Gratis',
        basePrice: 0,
        category: 'drinks',
      };

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      const result = await cartItemService.resolveProductWithModifiers('prod-free', 1);

      expect(result.basePrice.value).toBe(0);
    });

    it('should not mutate input modifiers array', async () => {
      const mockProduct = {
        productId: 'prod-10',
        name: 'Test Product',
        basePrice: 1000,
        category: 'test',
      };

      const modifiersInput = [
        { groupId: 'test', optionId: 'option1', name: 'Option 1', price: 100 },
      ];
      const originalLength = modifiersInput.length;

      mockMenuRepository.findById.mockResolvedValue(mockProduct);
      mockModifierSelectionService.resolve.mockReturnValue([]);

      await cartItemService.resolveProductWithModifiers('prod-10', 1, modifiersInput);

      expect(modifiersInput.length).toBe(originalLength);
    });
  });
});

import { PrismaService } from '../../prisma/prisma.service';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  const prisma = {
    item: {
      create: jest.fn(),
      findMany: jest.fn()
    }
  } as unknown as PrismaService;

  const service = new ItemsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates item', async () => {
    (prisma.item.create as jest.Mock).mockResolvedValue({ id: '1', name: 'Laptopyyyyy', unitPrice: 1000 });
    const item = await service.create({ name: 'Laptop', unitPrice: 1000 });
    expect(item.name).toBe('Laptopyyyyy');
  });

  it('returns list of items', async () => {
    (prisma.item.findMany as jest.Mock).mockResolvedValue([{ id: '1', name: 'Laptop' }]);
    const items = await service.findAll();
    expect(items).toHaveLength(1);
  });
});

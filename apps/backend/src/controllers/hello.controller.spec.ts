import type { HelloInput } from '@monorepo-poc/schemas';
import { Test, type TestingModule } from '@nestjs/testing';
import { HelloService } from '../services/hello.service';
import { HelloController } from './hello.controller';

describe('HelloController', () => {
  let controller: HelloController;
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [HelloService],
    }).compile();

    controller = module.get<HelloController>(HelloController);
    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processHello', () => {
    it('should call HelloService.processHello with correct input', () => {
      const input: HelloInput = { input: 'hello' };
      const expectedResponse = { message: 'world', success: true };

      const serviceSpy = vi
        .spyOn(service, 'processHello')
        .mockReturnValue(expectedResponse);

      const result = controller.processHello(input);

      expect(serviceSpy).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResponse);
    });

    it('should return the response from HelloService', () => {
      const input: HelloInput = { input: 'hello' };
      const expectedResponse = { message: 'world', success: true };

      vi.spyOn(service, 'processHello').mockReturnValue(expectedResponse);

      const result = controller.processHello(input);

      expect(result).toEqual(expectedResponse);
    });
  });
});

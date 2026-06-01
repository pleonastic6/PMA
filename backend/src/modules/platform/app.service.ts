import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRootPayload() {
    return {
      name: 'PMA Backend',
      architecture: 'modular-monolith',
      docs: '/api/platform/modules',
    };
  }
}

import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.hoisted(() => vi.fn());

vi.mock('@api/lib/kafka', () => ({
  apiKafkaProducer: { send },
}));

import { Topics } from '@shared/kafka/topics';
import { userService } from '../modules/user/user.service';

describe('UserService', () => {
  beforeEach(() => {
    send.mockClear();
  });

  it('publishes a user marketing consent message', async () => {
    await userService.updateUserMarketingConsent({
      user: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
      accepts_marketing: false,
    });

    expect(send).toHaveBeenCalledWith({
      topic: Topics.USER_MARKETING_CONSENT,
      message: { id: 1, email: 'jane@example.com', accepts_marketing: false },
    });
  });
});

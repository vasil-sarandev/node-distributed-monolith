import { describe, expect, it, vi } from 'vitest';

import { handleMessage } from '../handle-message';

describe('user-marketing-consent handleMessage', () => {
  it('logs the marketing consent update', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await handleMessage({ id: 1, email: 'jane@example.com', accepts_marketing: true });

    expect(log).toHaveBeenCalledWith(
      'Sending user with email jane@example.com marketing consent: TRUE to third party marketing integrations'
    );

    log.mockRestore();
  });
});

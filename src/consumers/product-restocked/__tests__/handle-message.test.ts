import { describe, expect, it, vi } from 'vitest';

import { handleMessage } from '../handle-message';

describe('product-restocked handleMessage', () => {
  it('logs the restock campaign message', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await handleMessage({ id: 1, name: 'Widget', quantity: 60 });

    expect(log).toHaveBeenCalledWith(
      'Sending marketing campaigns to customers subscribed to the restock of Widget after 60 items were restocked'
    );

    log.mockRestore();
  });
});

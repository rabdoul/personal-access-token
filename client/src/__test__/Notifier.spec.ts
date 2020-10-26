import { computeNotifierEnv } from '../Notification';
import { NotifierEnv } from 'cutting-room-notifier-client';

describe('Notifier', () => {
  describe('computeNotifierEnv', () => {
    it('case Local', () => {
      expect(computeNotifierEnv('localhost')).toBe(NotifierEnv.Local);
    });

    it('case Dev', () => {
      expect(computeNotifierEnv('cutting-room-parameters.dev.mylectra.com')).toBe(NotifierEnv.Dev);
    });

    it('case Test', () => {
      expect(computeNotifierEnv('cutting-room-parameters.test.mylectra.com')).toBe(NotifierEnv.Test);
    });

    it('case Prod', () => {
      expect(computeNotifierEnv('cutting-room-parameters.mylectra.com')).toBe(NotifierEnv.Prod);
    });
  });
});

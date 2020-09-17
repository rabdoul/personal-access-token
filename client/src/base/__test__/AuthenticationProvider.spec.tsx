import { isGrantedUser } from '../Authentication';

describe('AuthenticationProvider', () => {
  describe('isGrantedUser', () => {
    it('should return true when offer OD', () => {
      expect(isGrantedUser({ 'https://metadata.lectra.com/app_metadata': { authorizations: [{ offer: 'OD', market: 'FA' }] } })).toBeTruthy();
    });

    it('should return true when offer MTO', () => {
      expect(isGrantedUser({ 'https://metadata.lectra.com/app_metadata': { authorizations: [{ offer: 'MTO', market: 'FA' }] } })).toBeTruthy();
    });

    it('should return true when offer MTC', () => {
      expect(isGrantedUser({ 'https://metadata.lectra.com/app_metadata': { authorizations: [{ offer: 'MTC', market: 'FA' }] } })).toBeTruthy();
    });

    it('should return true when offer MTM', () => {
      expect(isGrantedUser({ 'https://metadata.lectra.com/app_metadata': { authorizations: [{ offer: 'MTM', market: 'FA' }] } })).toBeTruthy();
    });

    it('should return false when offer not granted', () => {
      expect(isGrantedUser({ 'https://metadata.lectra.com/app_metadata': { authorizations: [{ offer: 'UNKNOWN', market: 'FA' }] } })).toBeFalsy();
    });
  });
});

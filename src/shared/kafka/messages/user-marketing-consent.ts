import { IUser } from '../../../api/modules/user/user.model';

export type IUserMarketingConsentMessage = Pick<IUser, 'id' | 'email'> & {
  accepts_marketing: boolean;
};

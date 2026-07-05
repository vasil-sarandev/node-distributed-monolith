import { IUserMarketingConsentMessage } from '@shared/kafka/messages/user-marketing-consent.model';

export const handleMessage = async (message: IUserMarketingConsentMessage) => {
  console.log(
    `Sending user with email ${message.email} marketing consent: ${message.accepts_marketing.toString().toUpperCase()} to third party marketing integrations`
  );
};

import { IUserMarketingConsentMessage } from '@shared/kafka/messages/user-marketing-consent.model';
import { Topics } from '@shared/kafka/topics';
import { apiKafkaProducer } from '@api/lib/kafka';
import { IUser } from './user.model';
import { UserRepository, userRepository } from './user.repository';

class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = userRepository) {
    this.userRepository = repository;
  }

  getAllUsers = async (): Promise<IUser[]> => {
    return this.userRepository.getAllUsers();
  };

  getUserById = async (id: number): Promise<IUser | null> => {
    return this.userRepository.getUserById({ id });
  };

  updateUserMarketingConsent = async ({ user, accepts_marketing }: { user: IUser; accepts_marketing: boolean }) => {
    const message: IUserMarketingConsentMessage = {
      id: user.id,
      email: user.email,
      accepts_marketing: accepts_marketing,
    };
    return apiKafkaProducer.send({ topic: Topics.USER_MARKETING_CONSENT, message: message });
  };
}

export const userService = new UserService();

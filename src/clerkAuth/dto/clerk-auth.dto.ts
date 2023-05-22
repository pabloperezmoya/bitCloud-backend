export enum EventType {
  USER_UPDATED = 'user.updated',
  USER_CREATED = 'user.created',
}

export type ParcialPayload = {
  userId: string;
  name: string;
  email: string;
};

export type ClerkPayload = {
  data: Data;
  object: string;
  type: EventType;
};

type emailAddress = {
  email_address: string;
  id: string;
  linked_to: any[];
  object: string;
  verification: object;
};

type Data = {
  backup_code_enabled: boolean;
  banned: boolean;
  birthday: string;
  created_at: number;
  email_addresses: emailAddress[];
  external_accounts: any[];
  external_id: string;
  first_name: string;
  gender: string;
  id: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number;
  object: string;
  password_enabled: boolean;
  phone_numbers: any[];
  primary_email_address_id: string;
  primary_phone_number_id: string;
  primary_web3_wallet_id: string;
  private_metadata: object;
  profile_image_url: string;
  public_metadata: object;
  saml_accounts: any[];
  totp_enabled: boolean;
  two_factor_enabled: boolean;
  unsafe_metadata: object;
  updated_at: number;
  username: string;
  web3_wallets: any[];
};

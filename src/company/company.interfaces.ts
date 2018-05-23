

export interface AddressData {
  id: number;
  address: string;
  city: string;
};

export interface CompanyData {
  name: string; // required field with minimum 5 characters
  addresses: AddressData[]; // user can have one or more addresses
}

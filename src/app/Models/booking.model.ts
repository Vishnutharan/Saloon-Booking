import { Service } from "./service.model";

export interface UserInfo {
  name: string;
  phone: string;
  email: string;
}

export interface PaymentDetails {
  method: 'creditCard' | 'paypal' | 'cash' | '';
  amount: number;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}

export interface BookingData {
  service: Service | null;
  time: string | null;
  seat: string | null;
  userInfo: UserInfo;
  paymentDetails: PaymentDetails;
  isConfirmed: boolean;
}

export const initialBookingData: BookingData = {
    service: null,
    time: null,
    seat: null,
    userInfo: {
        name: '',
        phone: '',
        email: ''
    },
    paymentDetails: {
        method: '',
        amount: 0
    },
    isConfirmed: false
};
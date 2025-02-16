declare module 'react-native-get-sms-android' {
  export interface SmsFilter {
    box?: string;
    read?: number;
    _id?: string;
    address?: string;
    body?: string;
    maxCount?: number;
    minDate?: number;
    maxDate?: number;
  }

  export interface SmsAndroid {
    autoSend(
      phoneNumber: string,
      message: string,
      failureCallback: (error: any) => void,
      successCallback: () => void,
    ): void;

    list(
      filter: string,
      failureCallback: (error: any) => void,
      successCallback: (count: number, smsList: string) => void,
    ): void;
  }

  const SmsAndroid: SmsAndroid;
  export default SmsAndroid;
}

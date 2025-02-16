import React, {useState, useEffect} from 'react';
import {
  Alert,
  Platform,
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

interface SMS {
  _id: number;
  thread_id: number;
  address: string;
  date: number;
  body: string;
}

const App: React.FC = () => {
  const [sendTo, setSendTo] = useState('');
  const [sendBody, setSendBody] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [smsList, setSmsList] = useState<SMS[]>([]);

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        try {
          if (!(await checkPermissions())) {
            await requestPermissions();
          }
          if (await checkPermissions()) {
            listSMS();
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    initialize();
  }, []);

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const hasReadPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      const hasSendPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      return hasReadPermission && hasSendPermission;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ]);
      if (
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === 'granted' &&
        granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === 'granted'
      ) {
        console.log('You can use SMS features');
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const sendSMS = () => {
    SmsAndroid.autoSend(
      sendTo,
      sendBody,
      (err: any) => Alert.alert('Failed to send SMS', err.toString()),
      () => Alert.alert('SMS sent successfully'),
    );
  };

  const listSMS = () => {
    const filter: any = {box: 'inbox', maxCount: 30};
    if (minDate) {
      filter.minDate = minDate;
    }
    if (maxDate) {
      filter.maxDate = maxDate;
    }

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: any) => console.log('Failed with error: ', fail),
      (count: any, smsList: string) => {
        setSmsList(JSON.parse(smsList));
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Send SMS</Text>
      <Text>To</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSendTo}
        value={sendTo}
        keyboardType="numeric"
      />
      <Text>Message</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSendBody}
        value={sendBody}
      />
      <Button title="Send SMS" onPress={sendSMS} />
      <Button title="Refresh Messages" onPress={listSMS} />
      <ScrollView>
        {smsList.map(sms => (
          <View key={sms._id} style={styles.smsItem}>
            <Text>From: {sms.address}</Text>
            <Text>Body: {sms.body}</Text>
            <Text>Date: {new Date(sms.date).toString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 20,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  smsItem: {
    borderColor: '#bbb',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
  },
});

export default App;

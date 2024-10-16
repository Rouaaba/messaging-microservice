import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<800'],
  },
};

const BASE_URL = 'http://172.27.0.7:8080/api';
const USERNAME = 'bbb';
const PASSWORD = 'bbb';
const FRIEND_ID = 2;

export default function () {
  // Log in to get the auth token
  let loginRes = http.post(`${BASE_URL}/auth/signin`, JSON.stringify({
    username: USERNAME,
    password: PASSWORD,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  let loginResponse = JSON.parse(loginRes.body);
  let authToken = loginResponse.token;
  let userId = loginResponse.id; // Use 'id' instead of 'userId'

  // Send a message to the friend with ID 4
  let messageRes = http.post(`${BASE_URL}/message`, JSON.stringify({
    senderId: userId,
    recipientId: FRIEND_ID, // Use the known ID for the friend
    content: 'Hello from k6 load test!',
  }), {
    headers: { 
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  check(messageRes, {
    'message sent successfully': (r) => r.status === 200,
  });

  sleep(1);
}

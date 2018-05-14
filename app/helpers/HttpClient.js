import axios from 'axios'
import sessionManager from './SessionManager';

export const SERVER_IP = '10.1.73.34'; // localhost
export const SERVER_PORT = 8080;

export const HttpClient = axios.create(
{
    baseURL: 'http://'+SERVER_IP+':'+SERVER_PORT+'/', headers: {'Content-Type': 'application/json;'}
    // , session_id: sessionManager.getSessionId()
});

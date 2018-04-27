import axios from 'axios'
import * as SessionManager from './SessionManager';

export const HttpClient = axios.create(
{
    baseURL: 'http://127.0.0.1:8080/', headers: {'Content-Type': 'application/json;', session_id: SessionManager.session_id}
});

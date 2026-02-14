import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    try {
        console.log('1. Testing Login...');
        const loginResponse = await axios.post(`${API_URL}/login`, {
            username: 'admin',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log(' - Login Successful. Token:', token.substring(0, 20) + '...');

        console.log('2. Testing Protected Route (/me)...');
        const meResponse = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(' - Protected Route Access Successful:', meResponse.data);

        console.log('3. Testing Invalid Token...');
        try {
            await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer invalid_token` }
            });
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                console.log(' - Invalid Token Rejected correctly (403 Forbidden)');
            } else {
                console.error(' - Unexpected error for invalid token:', error.message);
            }
        }

    } catch (error: any) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAuth();

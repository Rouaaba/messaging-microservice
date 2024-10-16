const axios = require('axios'); // Use CommonJS syntax

const testLogin = async () => {
    const credentials = { username: 'john', password: 'securePassword1234' };
    try {
        const response = await axios.post('http://172.25.0.11:8080/api/auth/signin', credentials);
        console.log(response.data);
    } catch (error) {
        console.error('Login failed:', error.response.data);
    }
};

testLogin();

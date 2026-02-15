async function testLogin() {
  const url = 'http://localhost:3000/api/auth/login';
  const body = JSON.stringify({
    username: 'admin',
    password: 'admin123'
  });

  console.log(`Testing calling ${url} with:`, body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    console.log('Status Code:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login Success:', data);
    } else {
      const text = await response.text();
      console.log('Login Failed:', text);
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

testLogin();

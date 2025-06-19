    document.getElementById('signupForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const skills = document.getElementById('skills').value;

      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, skills }),
      });

      const data = await response.json();
      document.getElementById('message').textContent = data.message;
    });



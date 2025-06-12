const form = document.getElementById('form');
const userList = document.getElementById('userList');
let editingId = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const email = form.email.value;

  const url = editingId ? `/users/${editingId}` : '/users';
  const method = editingId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  form.reset();
  editingId = null;
  loadUsers();
});

async function loadUsers() {
  const res = await fetch('/users');
  const users = await res.json();
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${user.name} (${user.email})
      <div>
        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">✏️</button>
        <button onclick="deleteUser(${user.id})">🗑️</button>
      </div>
    `;
    userList.appendChild(li);
  });
}

function editUser(id, name, email) {
  form.name.value = name;
  form.email.value = email;
  editingId = id;
}

async function deleteUser(id) {
  await fetch(`/users/${id}`, { method: 'DELETE' });
  loadUsers();
}

loadUsers();

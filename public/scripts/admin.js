let apiUrl = '';
        let userPermissions = [];
        let availablePermissions = [];
        const token = () => document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        document.addEventListener("DOMContentLoaded", async () => {
            apiUrl = await getApiUrl();
            if (token()) {
                const success = await fetchPermissions();
                if (success) renderMainSection();
            }
        });

        async function getApiUrl() {
            const response = await fetch('/apiurl');
            const data = await response.json();
            return data.apiurl;
        }

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${apiUrl}/user/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();

                    if (location.protocol !== 'https:') {
                        document.cookie = `token=${data.token}; path=/`;
                    } else {
                        document.cookie = `token=${data.token}; path=/; SameSite=None; Secure`;
                    }

                    setTimeout(async () => {
                        const success = await fetchPermissions();
                        if (success) renderMainSection();
                    }, 500);
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred. Please try again later.');
            }
        }

        async function fetchPermissions() {
            try {
                const response = await fetch(`${apiUrl}/user/selfperms`, {
                    headers: { 'Authorization': `Bearer ${token()}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    userPermissions = data.permissions;
                    return true;
                } else {
                    alert('Failed to fetch permissions.');
                    return false;
                }
            } catch (error) {
                console.error('Error fetching permissions:', error);
                return false;
            }
        }

        async function renderMainSection() {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('main-section').classList.remove('hidden');

            console.log('User permissions:', userPermissions);

            const canCreateUser = userPermissions.includes('*') || userPermissions.includes('create_user');
            const canDeleteUser = userPermissions.includes('*') || userPermissions.includes('delete_user');
            const canViewUsers = canCreateUser || canDeleteUser;

            if (canCreateUser) {
                fetchAvailablePermissions();
                document.getElementById('user-create-container').classList.remove('hidden');
            }

            if (canViewUsers) {
                renderUserList();
            }

            if (!canCreateUser && !canDeleteUser) {
                document.getElementById('no-permissions-message').classList.remove('hidden');
                document.getElementById('user-permissions').textContent = userPermissions.join(', ');
            }
        }

        async function fetchAvailablePermissions() {
            try {
                const response = await fetch(`${apiUrl}/user/permissions`, {
                    headers: { 'Authorization': `Bearer ${token()}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    availablePermissions = data.permissions;
                    console.log('Available permissions:', availablePermissions);
                    const permissionsContainer = document.getElementById('permissions-container');
                    permissionsContainer.innerHTML = '';
                    availablePermissions.forEach(permission => {
                        const checkbox = document.createElement('div');
                        checkbox.className = 'flex items-center';
                        checkbox.innerHTML = `
                            <input type="checkbox" id="${permission}" name="permissions" value="${permission}" class="mr-2">
                            <label for="${permission}">${permission}</label>
                        `;
                        permissionsContainer.appendChild(checkbox);
                    });
                }
            } catch (error) {
                console.error('Error fetching available permissions:', error);
            }
        }

        async function renderUserList() {
            try {
                const response = await fetch(`${apiUrl}/user/list`, {
                    headers: { 'Authorization': `Bearer ${token()}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const userListContainer = document.getElementById('user-list-container');
                    const userList = document.getElementById('user-list');
                    userListContainer.classList.remove('hidden');
                    userList.innerHTML = '';

                    data.users.forEach(user => {
                        const userItem = document.createElement('div');
                        userItem.className = 'bg-gray-700 p-3 rounded flex justify-between items-center';
                        userItem.innerHTML = `
                            <div>
                                <strong>${user.name}</strong>
                                <div class="text-sm text-gray-400">Permissions: ${user.permissions.join(', ')}</div>
                            </div>
                        `;

                        if (userPermissions.includes('*') || userPermissions.includes('delete_user')) {
                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition duration-300';
                            deleteButton.textContent = 'Delete';
                            deleteButton.onclick = () => deleteUser(user.name);
                            userItem.appendChild(deleteButton);
                        }

                        userList.appendChild(userItem);
                    });
                }
            } catch (error) {
                console.error('Error rendering user list:', error);
            }
        }

        async function createUser(event) {
            event.preventDefault();
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(checkbox => checkbox.value);

            try {
                const response = await fetch(`${apiUrl}/user/create`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, permissions })
                });

                if (response.ok) {
                    alert('User created successfully.');
                    renderUserList();
                } else {
                    alert('Failed to create user.');
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }

        async function deleteUser(username) {
            if (!confirm(`Are you sure you want to delete ${username}?`)) return;

            try {
                const response = await fetch(`${apiUrl}/user/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                if (response.ok) {
                    alert('User deleted successfully.');
                    renderUserList();
                } else {
                    alert('Failed to delete user.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }

        function logout() {
            document.cookie = 'token=; Max-Age=0; path=/';
            window.location.reload();
        }
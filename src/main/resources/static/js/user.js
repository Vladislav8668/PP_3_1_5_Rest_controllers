// Инициализация при загрузке страницы и получение id зашедшего пользователя
const userId = document.getElementById('user-data').dataset.userId;
document.addEventListener('DOMContentLoaded', async () => loadTableWithUser(userId));

// Вспомогательный сервис
const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findOneUser: async (id) => await fetch(`api/users/${id}`),
}

// Функция для загрузки таблицы одного зашедшего пользователя
async function loadTableWithUser(id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = await preuser.json();

    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    const row = document.createElement('tr');
    const roles = user.roles.map(role => {
        return role.name.startsWith('ROLE_') ? role.name.substring(5) : role.name;
    }).join(' ');

    row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName || ''}</td>
                    <td>${user.lastName || ''}</td>
                    <td>${user.age || ''}</td>
                    <td>${user.username || ''}</td>
                    <td>${roles}</td>
                `;
    tableBody.appendChild(row);
}

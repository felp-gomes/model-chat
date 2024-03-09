const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById('users');
const messageDiv = document.getElementById('messages');

function createdMessage(data) {
  messageDiv.innerHTML += `<div class="new_message">
        <label>
          <strong>${data.username}</strong> <span>${data.text} - ${new Date(
    data.createdAt
  ).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}</span>
        </label>
      </div>`;
}

usernameDiv.innerHTML += `<h3>Você, ${username}, entrou na sala ${room}</h3>`;

socket.emit(
  'select_room',
  {
    username,
    room,
  },
  (messages) => {
    messages.forEach((message) => createdMessage(message));
  }
);

document
  .getElementById('message_input')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;
      const data = {
        room,
        message,
        username,
      };
      socket.emit('message', data);
      event.target.value = '';
    }
  });

socket.on('message', (data) => {
  createdMessage(data);
});

document.getElementById('logout').addEventListener('click', (event) => {
  window.location.href = 'index.html';
});

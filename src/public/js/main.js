document.addEventListener('DOMContentLoaded', (event) => {
  const socket = io();

  // Configuración de chat
  const usersList = document.getElementById('usersList');
  if (usersList) {
    usersList.addEventListener('click', function(event) {
      if (event.target && event.target.closest('.user-item')) {
        const selectedUserId = event.target.closest('.user-item').getAttribute('data-id');
        window.location.href = `/chat/${selectedUserId}`;
      }
    });

    const form = document.getElementById('send-message-form');
    const input = document.getElementById('message-input');
    const messages = document.getElementById('messages');
    const receiverId = document.getElementById('selectedUserId').value;
    const senderId = document.getElementById('currentUserId').value;

    socket.emit('join', { senderId, receiverId });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', { senderId, receiverId, message: input.value });
        input.value = '';
      }
    });

    socket.on('chat message', function({ senderId: msgSenderId, receiverId: msgReceiverId, message }) {
      if ((senderId === msgSenderId && receiverId === msgReceiverId) || (senderId === msgReceiverId && receiverId === msgSenderId)) {
        const item = document.createElement('div');
        item.textContent = message;
        item.classList.add('message');
        if (msgSenderId === senderId) {
          item.classList.add('current-user');
        } else {
          item.classList.add('other-user');
        }
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
      }
    });

    document.querySelectorAll('#messages .message').forEach(item => {
      const msgSenderId = item.getAttribute('data-sender-id');
      if (msgSenderId === senderId) {
        item.classList.add('current-user');
      } else {
        item.classList.add('other-user');
      }
    });
  }

  // Configuración de notas
  const noteIdElement = document.getElementById('noteId');
  if (noteIdElement) {
    const noteId = noteIdElement.value;
    socket.emit('joinNote', noteId);
    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
      noteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const tituloInput = document.getElementById('titulo');
        const descripcionInput = document.getElementById('descripcion');
        const titulo = tituloInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        if (titulo && descripcion) {
          socket.emit('editNote', { noteId, titulo, descripcion });
        }
      });
    }
    socket.on('noteUpdated', function(data) {
      const tituloInput = document.getElementById('titulo');
      const descripcionInput = document.getElementById('descripcion');
      tituloInput.value = data.titulo;
      descripcionInput.value = data.descripcion;
    });
  }
  // Configuración para actualizar notas en fullnotes
  const notesContainer = document.getElementById('notesContainer');
  if (notesContainer) {
    socket.on('noteUpdated', function(data) {
      const noteElement = document.getElementById(`note-${data.id}`);
      if (noteElement) {
        noteElement.querySelector('.note-title').textContent = data.titulo;
        noteElement.querySelector('.note-description').textContent = data.descripcion;
      }
    });
  }
});
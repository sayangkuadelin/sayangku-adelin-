window.onload = () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const openBtn = document.getElementById('open-btn');

  openBtn.addEventListener('click', () => {
    // Menghilangkan menu awal dengan efek fade
    welcomeScreen.classList.add('fade-out');
    
    // Memberikan jeda sedikit agar transisi mulus sebelum bunga mekar
    setTimeout(() => {
      document.body.classList.remove("container");
    }, 400);
  });
};
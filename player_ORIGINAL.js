   document.addEventListener("DOMContentLoaded", function () {
        // Elemen DOM
        const videoPlayer = document.getElementById("videoPlayer");
        const playPauseBtn = document.getElementById("playPauseBtn");
        const muteBtn = document.getElementById("muteBtn");
        const volumeSlider = document.getElementById("volumeSlider");
        const progressContainer = document.getElementById("progressContainer");
        const progressBar = document.getElementById("progressBar");
        const currentTimeElement = document.getElementById("currentTime");
        const durationElement = document.getElementById("duration");
        const playbackSpeed = document.getElementById("playbackSpeed");
        const fullscreenBtn = document.getElementById("fullscreenBtn");
        const spinner = document.getElementById("spinner");
        const errorMessage = document.getElementById("errorMessage");
        const container = document.querySelector(".container");
        const videoContainer = document.getElementById("videoContainer");
        const centerPlayBtn = document.getElementById("centerPlayBtn");
        const downloadBtn = document.getElementById("downloadBtn");

        // Ambil parameter video ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("id");

        // Setup video source
        if (videoId) {
          // Tampilkan loading spinner
          spinner.style.display = "block";

          // Set sumber video
          const videoUrl = "https://cdn.videy.co/" + videoId + ".mp4";
          videoPlayer.src = videoUrl;
          downloadBtn.href = videoUrl;
          downloadBtn.setAttribute("download", videoId + ".mp4");

          // Event ketika video dimuat
          videoPlayer.addEventListener("loadeddata", function () {
            spinner.style.display = "none";
            durationElement.textContent = formatTime(videoPlayer.duration);
          });

          // Event ketika video sedang dimuat
          videoPlayer.addEventListener("waiting", function () {
            spinner.style.display = "block";
          });

          videoPlayer.addEventListener("canplay", function () {
            spinner.style.display = "none";
          });

          // Event error video
          videoPlayer.addEventListener("error", function () {
            spinner.style.display = "none";
            errorMessage.style.display = "block";
          });

          // Awalnya video dalam keadaan pause
          videoPlayer.pause();
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          videoContainer.classList.add("paused");
        } else {
          errorMessage.innerHTML =
            '<i class="fas fa-exclamation-circle"></i><p>Video tidak ditemukan</p>';
          errorMessage.style.display = "block";
        }

        // Format waktu (detik ke menit:detik)
        function formatTime(seconds) {
          if (isNaN(seconds)) return "00:00";

          let minutes = Math.floor(seconds / 60);
          let secs = Math.floor(seconds % 60);
          return `${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }

        // Fungsi toggle play/pause
        function togglePlayPause() {
          if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            centerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoContainer.classList.remove("paused");
          } else {
            videoPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            centerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoContainer.classList.add("paused");
          }
        }

        // Toggle play/pause dari tombol kontrol
        playPauseBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          togglePlayPause();
        });

        // Toggle play/pause dari tombol tengah
        centerPlayBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          togglePlayPause();
        });

        // Toggle play/pause dari klik pada video
        videoContainer.addEventListener("click", function (e) {
          // Jangan trigger jika klik pada progress bar atau kontrol lainnya
          if (e.target === videoContainer || e.target === videoPlayer) {
            togglePlayPause();
          }
        });

        // Update progress bar
        videoPlayer.addEventListener("timeupdate", function () {
          const currentTime = videoPlayer.currentTime;
          const duration = videoPlayer.duration;
          const progressPercent = (currentTime / duration) * 100;

          progressBar.style.width = `${progressPercent}%`;
          currentTimeElement.textContent = formatTime(currentTime);
        });

        // Klik pada progress bar untuk mengubah posisi pemutaran
        progressContainer.addEventListener("click", function (e) {
          const progressWidth = this.clientWidth;
          const clickX = e.offsetX;
          const duration = videoPlayer.duration;

          videoPlayer.currentTime = (clickX / progressWidth) * duration;
        });

        // Toggle mute/unmute
        muteBtn.addEventListener("click", function () {
          videoPlayer.muted = !videoPlayer.muted;
          muteBtn.innerHTML = videoPlayer.muted
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-volume-up"></i>';

          volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume;
        });

        // Ubah volume
        volumeSlider.addEventListener("input", function () {
          videoPlayer.volume = volumeSlider.value;
          videoPlayer.muted = volumeSlider.value === 0;

          muteBtn.innerHTML =
            volumeSlider.value == 0
              ? '<i class="fas fa-volume-mute"></i>'
              : '<i class="fas fa-volume-up"></i>';
        });

        // Ubah kecepatan pemutaran
        playbackSpeed.addEventListener("change", function () {
          videoPlayer.playbackRate = parseFloat(this.value);
        });

        // Toggle fullscreen dengan fallback untuk browser yang berbeda
        fullscreenBtn.addEventListener("click", function () {
          if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
          ) {
            // Masuk ke fullscreen
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
              container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
              container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
              container.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          } else {
            // Keluar dari fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          }
        });

        // Perbarui ikon play/pause saat video dijalankan/dijeda
        videoPlayer.addEventListener("play", function () {
          playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
          centerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
          videoContainer.classList.remove("paused");
        });

        videoPlayer.addEventListener("pause", function () {
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          centerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
          videoContainer.classList.add("paused");
        });

        // Handle fullscreen change events for different browsers
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange
        );
        document.addEventListener(
          "mozfullscreenchange",
          handleFullscreenChange
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        function handleFullscreenChange() {
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          }
        }

        // Handle orientation changes
        window.addEventListener("orientationchange", function () {
          // Small timeout to wait for orientation change to complete
          setTimeout(function () {
            videoPlayer.style.height = "100%";
            videoPlayer.style.width = "100%";
          }, 200);
        });

        // Fungsi deteksi Developer Tools
        function detectDevTools() {
          const threshold = 160; // batas ukuran untuk deteksi
          let widthThreshold = window.outerWidth - window.innerWidth > threshold;
          let heightThreshold = window.outerHeight - window.innerHeight > threshold;

          if (widthThreshold || heightThreshold) {
            // Jika DevTools terbuka, redirect
            window.location.href = "https://doodestream.com";
          }
        }

        // Cek setiap 500ms
        setInterval(detectDevTools, 500);

        // Mencegah klik kanan
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          alert("Klik kanan tidak diizinkan!");
        });

        // Mencegah tombol tertentu (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
        document.addEventListener('keydown', function(e) {
          if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
            (e.ctrlKey && e.key === "U")
          ) {
            e.preventDefault();
            alert("Aksi ini tidak diizinkan!");
            window.location.href = "https://doodestream.com";
          }
        });

        // Script untuk redirect random
        const links = ["#"];
        let canClick = true; // flag untuk delay 6 detik

        function openRandomLink() {
          const randomLink = links[Math.floor(Math.random() * links.length)];

          // kalau kosong atau hanya "#", jangan lakukan apa-apa
          if (!randomLink || randomLink === "#") {
            return;
          }

          // buka di tab baru (_blank)
          window.open(randomLink, "_blank");
        }

        // Hanya trigger untuk klik di luar video player
        document.addEventListener("click", (e) => {
          const isControlElement =
            e.target.closest(".video-controls") ||
            e.target.closest(".video-title") ||
            e.target.closest(".center-play-btn");

          if (!canClick || isControlElement) return;

          canClick = false;

          openRandomLink();

          setTimeout(() => {
            canClick = true;
          }, 9000);
        });
      });

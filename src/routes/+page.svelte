<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    if ($user) {
      goto('/dashboard');
    }
  });
</script>

<div
  class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden relative"
>
  <!-- Background Elements -->
  <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
    ></div>
    <div
      class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
    ></div>
    <div
      class="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
    ></div>
  </div>

  <!-- Navbar -->
  <nav class="relative z-10 flex justify-between items-center px-8 py-6">
    <div class="text-2xl font-bold tracking-tighter">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400"
        >PetHealth</span
      >
    </div>
    <div class="space-x-4">
      <a
        href="/login"
        class="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
        >Đăng Nhập</a
      >
      <a
        href="/register"
        class="px-6 py-2 rounded-full bg-white text-indigo-900 font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >Bắt Đầu Ngay</a
      >
    </div>
  </nav>

  <!-- Hero Section -->
  <main
    class="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center"
  >
    <div class="lg:w-1/2 text-center lg:text-left">
      <h1 class="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
        Chăm Sóc Hiện Đại Cho <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400"
          >Thú Cưng Của Bạn</span
        >
      </h1>
      <p class="text-xl text-gray-300 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
        Quản lý hồ sơ sức khỏe, lịch hẹn và hóa đơn với nền tảng thế hệ mới dành cho sự xuất sắc
        trong thú y.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <a
          href="/login"
          class="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1"
        >
          Truy Cập Dashboard
        </a>
        <a
          href="#features"
          class="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 backdrop-blur-sm font-semibold text-lg transition-all"
        >
          Tìm Hiểu Thêm
        </a>
      </div>
    </div>

    <div class="lg:w-1/2 mt-16 lg:mt-0 relative">
      <!-- Glassmorphism Card -->
      <div
        class="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-all duration-500"
      >
        <div class="flex items-center space-x-4 mb-6">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-2xl"
          >
            🐕
          </div>
          <div>
            <h3 class="font-bold text-lg">Kiểm tra cho Max</h3>
            <p class="text-sm text-gray-300">Hôm nay, 2:00 Chiều</p>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-2 bg-white/20 rounded-full w-3/4"></div>
          <div class="h-2 bg-white/20 rounded-full w-1/2"></div>
        </div>
        <div class="mt-6 flex justify-between items-center">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full bg-blue-400 border-2 border-indigo-900"></div>
            <div class="w-8 h-8 rounded-full bg-purple-400 border-2 border-indigo-900"></div>
            <div class="w-8 h-8 rounded-full bg-pink-400 border-2 border-indigo-900"></div>
          </div>
          <span class="text-sm font-semibold text-green-400">Đã Xác Nhận</span>
        </div>
      </div>

      <!-- Floating Elements -->
      <div
        class="absolute -top-10 -right-10 w-20 h-20 bg-pink-500 rounded-2xl rotate-12 opacity-50 blur-xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-xl animate-bounce"
        style="animation-duration: 3s;"
      ></div>
    </div>
  </main>

  <!-- Features Section -->
  <section id="features" class="relative z-10 bg-black/20 backdrop-blur-lg py-20">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-10">
        <div
          class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-bold mb-2">Phân Tích Thông Minh</h3>
          <p class="text-gray-400">
            Theo dõi doanh thu, lịch hẹn và sự phát triển của bệnh nhân với các biểu đồ trực quan.
          </p>
        </div>
        <div
          class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <div class="text-4xl mb-4">🏥</div>
          <h3 class="text-xl font-bold mb-2">Hồ Sơ Sức Khỏe</h3>
          <p class="text-gray-400">
            Lịch sử kỹ thuật số hoàn chỉnh cho mọi thú cưng, truy cập trong vài giây.
          </p>
        </div>
        <div
          class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <div class="text-4xl mb-4">🔒</div>
          <h3 class="text-xl font-bold mb-2">Bảo Mật & Riêng Tư</h3>
          <p class="text-gray-400">
            Bảo mật cấp doanh nghiệp để giữ dữ liệu của bạn an toàn và tuân thủ.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>

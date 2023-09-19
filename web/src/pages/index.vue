<template>
  <div h-100vh w-full flex flex-col>
    <!-- Head -->
    <div h-14 w-full border />
    <div h-full flex>
      <!-- Nav Bar -->
      <div h-full w-40 flex flex-col overflow-y-auto border-r>
        <!-- Navigation Menu -->
        <nav class="nav-menu" mt-4>
          <ul>
            <li class="nav-item" mb-2>
              <a href="#" class="nav-link">Home</a>
            </li>
            <li class="nav-item" mb-2>
              <a href="#" class="nav-link">About</a>
            </li>
            <li class="nav-item" mb-2>
              <a href="#" class="nav-link">Services</a>
            </li>
            <li class="nav-item" mb-2>
              <a href="#" class="nav-link">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Body Content -->
      <div h-full w-full>
        123
      </div>
    </div>
  </div>
</template>

<style>
.nav-link {
  display: block;
  padding: 8px 16px;
  color: #495057;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #007bff;
}
</style>

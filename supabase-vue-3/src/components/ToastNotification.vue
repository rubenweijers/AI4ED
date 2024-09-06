<template>
    <transition name="toast">
      <div v-if="isVisible" class="toast-notification">
        <div class="toast-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>
        <div class="toast-actions">
          <button @click="onConfirm" class="confirm-button">Confirm</button>
          <button @click="onCancel" class="cancel-button">Cancel</button>
        </div>
      </div>
    </transition>
</template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      default: 'Confirmation',
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?',
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  const onConfirm = () => {
    emit('confirm');
  };
  
  const onCancel = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    max-width: 300px;
    z-index: 1000;
  }
  
  .toast-content {
    margin-bottom: 12px;
  }
  
  .toast-content h3 {
    margin: 0 0 8px;
    color: #333;
  }
  
  .toast-content p {
    margin: 0;
    color: #666;
  }
  
  .toast-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .toast-actions button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 8px;
  }
  
  .confirm-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .cancel-button {
    background-color: #f44336;
    color: white;
  }
  
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  </style>
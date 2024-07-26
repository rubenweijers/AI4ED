<template>
    <div class="delete-data-container">
      <button @click="confirmDelete" class="delete-button">Delete Saved Chat Data</button>
    </div>
</template>
  
  <script>
  export default {
    name: 'DeleteDataComponent',
    methods: {
      confirmDelete() {
        if (confirm('Are you sure you want to delete all saved chat data? This action cannot be undone.')) {
          this.deleteLocalData();
        }
      },
      deleteLocalData() {
        localStorage.removeItem('chatData');
        this.$emit('data-deleted');
        alert('Saved chat data has been deleted successfully.');
      }
    }
  }
  </script>
  
<style scoped>
  .delete-data-container {
    margin-top: 20px;
  }
  
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .delete-button:hover {
    background-color: #ff3333;
  }
</style>
  
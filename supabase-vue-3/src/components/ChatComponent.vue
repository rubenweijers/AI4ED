<!-- ChatComponent.vue -->

<template>
  <div>
    <h1>Chat with GPT-3.5</h1>
    <iframe v-if="gradioUrl" id="gradio-interface" width="100%" height="500px" :src="gradioUrl" frameborder="0"></iframe>
    <p v-else>Loading Gradio interface...</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ChatComponent',
  data() {
    return {
      gradioUrl: ''
    }
  },
  mounted() {
    axios.get('/gradio')
      .then(response => {
        console.log(response.data)
        // Assuming the URL of the Gradio interface is returned by the /gradio endpoint
        this.gradioUrl = 'https://ai4ed.vercel.app/gradio' // Adjust if needed
      })
      .catch(error => {
        console.error('Error fetching Gradio URL:', error)
      })
  }
}
</script>

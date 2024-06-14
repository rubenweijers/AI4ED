<!-- ChatComponent.vue -->

<template>
  <div>
    <h1>Chat with GPT-3.5</h1>
    <iframe id="gradio-interface" width="100%" height="500px" :src="gradioUrl" frameborder="0"></iframe>
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
    axios.get('https://ai4ed.vercel.app/gradio')
      .then(response => {
        console.log(response.data)
        this.gradioUrl = 'https://ai4ed.vercel.app/gradio' // Update with the actual URL if needed
      })
      .catch(error => {
        console.error(error)
      })
  }
}
</script>

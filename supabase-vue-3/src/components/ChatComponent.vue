<template>
  <div>
    <h1>Chat with GPT-3.5</h1>
    <iframe :src="gradioUrl" width="100%" height="500px"></iframe>
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
        // Assuming the response contains the URL to the Gradio interface
        this.gradioUrl = response.data.url
      })
      .catch(error => {
        console.error(error)
      })
  }
}
</script>

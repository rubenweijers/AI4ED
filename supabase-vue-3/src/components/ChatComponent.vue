<template>
  <div>
    <h1>Chat with GPT-3.5</h1>
    <iframe id="gradio-frame" src="https://ai4ed.vercel.app/gradio" width="100%" height="600px"></iframe>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ChatComponent',
  mounted() {
    axios.get('https://ai4ed.vercel.app/gradio')
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },
}
</script>

<style scoped>
#gradio-frame {
  border: none;
}
</style>

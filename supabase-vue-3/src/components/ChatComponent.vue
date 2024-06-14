<template>
  <div>
    <h1>Chat with GPT-3.5</h1>
    <gradio-interface />
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
  components: {
    'gradio-interface': {
      template: '<div id="gradio-interface"></div>'
    }
  }
}
</script>

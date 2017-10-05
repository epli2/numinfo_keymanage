<template>
  <div class="labo-key">
    <div class="block">
      <div v-if="isKeyExist === null" id="key-icon">
        ❓ 鍵は研究室内にありますん ❓
      </div>
      <div v-else-if="isKeyExist" id="key-icon">
        🔑 ⭕ 鍵は研究室内にあります
      </div>
      <div v-else id="key-icon">
        🔑 ❌ 鍵は研究室内にありません
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'

export default {
  name: 'labo-key',
  data () {
    return {
      isKeyExist: null
    }
  },
  mounted () {
    this.getKeyStatus()
    const socket = io('http://10.0.1.12:3000')
    var self = this
    socket.on('message', function (data) {
      self.isKeyExist = data.isKeyExist
    })
  },
  methods: {
    getKeyStatus () {
      const url = 'api/v1/labokey0'
      axios.get(url).then(res => {
        this.isKeyExist = res.data.isKeyExist
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
#key-icon {
  font-size: 30px;
}
</style>

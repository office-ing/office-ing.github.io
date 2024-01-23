import * as Vue from 'https://unpkg.com/vue@3.4.15/dist/vue.global.js';

import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')

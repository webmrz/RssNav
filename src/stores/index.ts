import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setStore } from './setStore'
import { statusStore } from './statusStore'
import { siteStore } from './siteStore'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { setStore, statusStore, siteStore }
export default pinia 
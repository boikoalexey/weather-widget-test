import { createApp, h, App } from 'vue'
import WeatherWidgetView from './views/WeatherWidgetView.vue'

class WeatherWidgetElement extends HTMLElement {
  private app: App | null = null

  connectedCallback() {
    const apiKey = this.getAttribute('api-key') || ''

    if (!apiKey) {
      this.innerHTML =
        '<div style="color: red; padding: 20px;">Error: api-key attribute is required</div>'
      return
    }

    const mountPoint = document.createElement('div')
    this.appendChild(mountPoint)

    this.app = createApp({
      render: () => h(WeatherWidgetView, { apiKey }),
    })

    this.app.mount(mountPoint)
  }

  disconnectedCallback() {
    if (this.app) {
      this.app.unmount()
    }
  }
}

if (!customElements.get('weather-widget')) {
  customElements.define('weather-widget', WeatherWidgetElement)
}

export { WeatherWidgetView }

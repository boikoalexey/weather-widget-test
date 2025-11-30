## Development

Start the development server with hot-reload:

```bash
npm run dev
```

- Create `public/index.html`
- Replace `YOUR_API_KEY_HERE` with your actual OpenWeather API key:
  ```html
  <weather-widget api-key="your-actual-api-key"></weather-widget>
  ```

The widget will be available at `http://localhost:8080`

## Production Build

Build the widget for production:

```bash
npm run build
```

This creates file in the `dist` directory:

- `weather-widget.js` - The widget JavaScript and styles bundle

## Usage

### Adding to Your Website

Simply add these two lines to your HTML file:

```html
<weather-widget api-key="YOUR_API_KEY_HERE"></weather-widget>
<script type="text/javascript" src="path/to/weather-widget.js"></script>
```

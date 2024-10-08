# WebHooks Demo

A Simple demo of using webhooks in an `expo` React Native app.

## Build and deploy the WebHooks Server

### ngrok setup

To test locally, it's best to use `ngrok` (or similar) since `localhost` URLs will not be avilable in the app.

Sample `ngrok.yml`:

```
version: "2"
authtoken: <auth-token>
tunnels:
  webhooks_server: # the Node WebHooks endpoint
    proto: http
    addr: 3000
    inspect: false
  webhooks_handler: # The Rust Webhooks handler (backend)
    proto: http
    addr: 8000
```

and then:

```bash
$ ngrok start --all
```

### The WebHooks Server

Configure the `WEBHOOKS_HANDLER_URL` value in `app.js` to point to the Rust backend.

```bash
$ cd pkg/webhooks_server
$ yarn install && yarn start
```

### The WebHooks Handler

Copy `.env.example` into `.env` and configure the values:

```
FCM_PROJECT_ID=
FCM_DEVICE_TOKEN=
FCM_CREDENTIALS_JSON_PATH=
```

```bash
$ cd pkg/webhooks_handler
$ RUST_LOG=info cargo run --release
```

### The app

Copy `.env.example` into `.env.local`, and set the value to the WebHooks Server URL:

```
EXPO_PUBLIC_WEBHOOKS_SERVER=
```

```bash
$ cd app
$ yarn setup --clean && yarn android
```

## Demo

![WebHooks Demo](https://github.com/timmyjose/webhooks-demo/blob/main/demo/webhooks_demo.gif)
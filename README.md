# Tuxedex (Next.js)

This dapp talks to a `trac-peer` HTTP RPC (default `http://127.0.0.1:5001/v1`) and uses the TAP wallet browser extension for **account + signing**.

## Configure peer RPC

The app server proxies requests to `trac-peer` via environment variables:

```sh
UPSTREAM_PROTOCOL=http
UPSTREAM_HOST=127.0.0.1
UPSTREAM_PORT=5001
UPSTREAM_PREFIX=/v1
```

## Run

```sh
npm install
npm run dev
```

## Peer endpoints used

- Contract interface: `GET /v1/contract/schema`
- Contract tx flow:
  - `GET /v1/contract/nonce`
  - `GET /v1/contract/tx/context`
  - `POST /v1/contract/tx` (`sim: true` then `sim: false`)
- State (Dex collection): `GET /v1/state?key=app/tuxedex/<pubKeyHex>&confirmed=false` (legacy key from the current contract)

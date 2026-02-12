# Wallet Integration

## Request Structure
```typescript
const walletRequest = {
  prepared_command: object,
  nonce: string,
  context: {
    networkId: number,
    txv: string,
    mbs: string,
    iw: string,
    bs?: string
  }
};
```

## Sign Transaction

```typescript
const { tx, signature } = await window.tracnetwork.signTracTx(walletRequest);
```

**Returns:**
- `tx`: Blake3 hash (hex, 64 chars)
- `signature`: Ed25519 signature (hex, 128 chars)

## Example

```json
{
  "prepared_command": { "type": "catch", "value": {} },
  "nonce": "a1b2c3d4e5f6...",
  "context": {
    "networkId": 918,
    "txv": "f6e6a812...",
    "mbs": "3c4d5e6f...",
    "iw": "7a8b9c0d...",
    "bs": "1a2b3c4d..."
  }
}
```

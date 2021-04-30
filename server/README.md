# Quickpoly server concept

## WebSocket API

### Connect
```
/v0
```

### Commands

#### Command message format

```
{ gameId?, playerId?, command, data? }
```

#### Command response message format
```
{ data } or { error }
```

### `getData` command

```
<empty>
-> { map, properties }
```

### `createGame` command

```
<empty>
-> { id, state, status: 'pending' }
```

### `getGame` command

```
<empty>
-> { id, state, status: 'pending' }
```

### `joinGame` command

```
<empty>
-> { id, state, status: 'pending' }
```

### Events

#### Event message format
```
{ gameId, event, data? }
```

#### `'playerJoined'` event
```
{ player: { id, name } }
```

#### `'playerLeft'` event
```
{ playerId }
```

#### `'gameStarted'` event
```
<empty>
```

#### `'gameEnded'` event
```
<empty>
```

#### `'moveStarted'` event
```
{ playerId }
```

#### `'propertyBought'` event
```
{ playerId, propertyId }
```

#### `'trade'` event
```
{ trade: { id, senderPlayerId, receiverPlayerId, deal } }
```

#### `'tradeAccepted'` event
```
{ tradeId }
```

#### `'tradeTimedOut'` event
```
{ tradeId }
```

#### `'tradeRejected'` event
```
{ tradeId }
```

#### `'diceRolled'` event
```
{ playerId, dice: [number, number] }
```

#### `'movedToSpace'` event
```
{ playerId, spaceId }
```

#### `'spaceAction'` event
```
{ playerId, spaceId, action }
```

#### `'moveEnded'` event
```
{ playerId }
```

#### `'playerGaveUp'` event
```
{ playerId }
```

#### `'playerBankrupt'` event
```
{ playerId }
```

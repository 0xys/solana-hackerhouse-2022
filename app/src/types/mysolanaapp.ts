export type Mysolanaapp = {
  "version": "0.1.0",
  "name": "mysolanaapp",
  "instructions": [
    {
      "name": "initGame",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "registerPlayer",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerOwner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stadium",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "bases",
            "type": "u8"
          },
          {
            "name": "outs",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "numOfPlayers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "playerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "lastPlay",
            "type": "u8"
          },
          {
            "name": "lastScore",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export const IDL: Mysolanaapp = {
  "version": "0.1.0",
  "name": "mysolanaapp",
  "instructions": [
    {
      "name": "initGame",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "registerPlayer",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "stadium",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerOwner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stadium",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "bases",
            "type": "u8"
          },
          {
            "name": "outs",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "numOfPlayers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "playerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "lastPlay",
            "type": "u8"
          },
          {
            "name": "lastScore",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

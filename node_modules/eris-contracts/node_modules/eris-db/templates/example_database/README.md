#Example Database

The data in /dbfolder can be used to set up a chain manually. It is a temporary solution until the eris-db docker container + eris-cli tool is ready for use.

### files

There are four files:

`config.toml` is the configuration file for the blockchain client (Tendermint). It is set up to be isolated, so that it does not sync up with an existing tendermint net.

`priv_validator.json` is used to commit blocks. Without a proper validator, no blocks will be committed to the chain.

`genesis.json` is where accounts and validators are defined.

Accounts can be found in the top, and is a list of the addresses and the amount of tokens they should receive. If an account is not in that list, it will have 0 tokens and won't be able to do anything (such as transacting) until some already existing account sends it some.

Validators is a list of validators, and it should at least contain the one you have in `priv_validator.json`. Looking in the genesis file you will see that the validators public key (`"CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"`) matches that of `priv_validator.json`. Btw - keys are always on the form `[x, hex]` where `x` is the key type (usually 1 for the standard Ed25519 type). `hex` is the hex string representation of the bytes. If using a different validator, changing the public key hex string to the one in that validator is all you need to do - but there really is no point in doing that for simple tests. The unbond to part is not important.
 
`server_conf.toml` is some basic server settings. The explanation for all the fields can be found in the eris-db [README.md](https://github.com/eris-ltd/eris-db.js) file.

There are no good docs yet about the various different fields in the three tendermint files afaik. There are some general info about keys in the eris-db `api.md` doc, which can be found in the eris-db repo root.

### generating new accounts and addresses

Generating new accounts can be done in several different ways. Apparently, the eris-keys tool does not print the private key if you generate a key, which means you can't use it to generate new accounts as you need to pass the private key in as a param to make transactions. Generating with "genPrivAccount" would provide address, public and private key, so it can be used to build the genesis.json from account addresses and then use the private keys to send transactions.

Later you can have the eris-keys daemon running, which means you will not need the private key because it is stored in the daemon. The way it works is you'll not use the `transact` method in eris-db.js, but instead take the tx parameters, pass them to the key daemon (which is running locally) and it will sign the data, then take the signed data and pass it through the method `broadcastTx`. The point of this is to avoid having to pass private key info over the net. It has not been fully incorporated into the javascript yet.

### running

Running eris-db directly on the dbfolder will update the validator and some things, which means it will be "tainted". It is better to copy that folder to somewhere else, and then do `erisdb /path/to/that/folder`.

If eris-db is not installed it can be installed via `go get github.com/eris-ltd/eris-db/cmd/erisdb`. That will fetch and put the executable in `$GOPATH/bin`. The executable is named `erisdb` 

### TL;DR

1. `git clone https://github.com/eris-ltd/eris-db.js` or `npm install eris-db`

2. cd into eris-db.js root folder.

3. Copy the contents of `./templates/example_database/dbfolder` to some folder.

4. Do any modifications of genesis json and such in that folder.

5. Follow install instructions in [eris-db repo](https://github.com/eris-ltd/eris-db) for the server.

6. Make sure `erisdb` exists on path `$ command -v erisdb`
  
7. Open another shell and run `erisdb /path/to/that/folder`, to start the server.

8. optionally run `$node ./examples/network_info/network_info.http.node.js` to make sure it works. If you don't change the port or moniker it should look like this:

```
{ client_version: '0.3.0',
  moniker: 'anothertester',
  listening: false,
  listeners: [],
  peers: [] 
}
```
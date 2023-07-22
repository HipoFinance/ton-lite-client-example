import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client"
import { Address } from "ton-core"

async function main() {
    const response = await fetch('https://ton.org/testnet-global.config.json')
    const config = await response.json()
    const liteservers = config.liteservers
    const randomIndex = Math.floor(Math.random()*liteservers.length)
    const server = liteservers[randomIndex]
    const engines = [new LiteSingleEngine({
        client: 'ws',
        host: `wss://ws.tonlens.com/?ip=${server.ip}&port=${server.port}&pubkey=${server.id.key}`,
        publicKey: Buffer.from(server.id.key, 'base64')
    })]
    const engine: LiteEngine = new LiteRoundRobinEngine(engines)
    const client = new LiteClient({ engine })
    console.log('get master info')
    const master = await client.getMasterchainInfo()
    console.log('master', master)

    const address = Address.parse('kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP')
    const accountState = await client.getAccountState(address, master.last)
    console.log('Account state:', accountState)
}

main()

function intToIP(int: number) {
    var part1 = int & 255
    var part2 = ((int >> 8) & 255)
    var part3 = ((int >> 16) & 255)
    var part4 = ((int >> 24) & 255)

    return part4 + "." + part3 + "." + part2 + "." + part1
}

import {PTPDevice} from '../PTPDevice'
import {TethrPTPUSB} from './TethrPTPUSB'

enum OpCodeCanon {
    SetRemoteMode = 0x9114,
    SetEventMode = 0x9115,
    RemoteReleaseOn = 0x9153,
    RemoteReleaseOff = 0x9154,
}

/**
 * Experimental Canon EOS support. Currently no vendor specific
 * commands are implemented but having a dedicated class makes it
 * easier to add them later.
 */
export class TethrCanon extends TethrPTPUSB {
    constructor(device: PTPDevice) {
        super(device)
    }

    async open(): Promise<void> {
        await super.open()

        await this.device.sendCommand({
            label: 'Canon SetRemoteMode',
            opcode: OpCodeCanon.SetRemoteMode,
            parameters: [1],
        })

        await this.device.sendCommand({
            label: 'Canon SetEventMode',
            opcode: OpCodeCanon.SetEventMode,
            parameters: [1],
        })
    }

    async close(): Promise<void> {
        await this.device.sendCommand({
            label: 'Canon SetEventMode Off',
            opcode: OpCodeCanon.SetEventMode,
            parameters: [0],
        })

        await this.device.sendCommand({
            label: 'Canon SetRemoteMode Off',
            opcode: OpCodeCanon.SetRemoteMode,
            parameters: [0],
        })

        await super.close()
    }

    async remoteRelease(): Promise<void> {
        await this.device.sendCommand({
            label: 'Canon RemoteReleaseOn',
            opcode: OpCodeCanon.RemoteReleaseOn,
        })

        await this.device.sendCommand({
            label: 'Canon RemoteReleaseOff',
            opcode: OpCodeCanon.RemoteReleaseOff,
        })
    }
}

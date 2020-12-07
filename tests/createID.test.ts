import { expect } from "chai"
import createID from "../src/helpers/createID/createID"

describe('IDGenerator Helper Test', () => {
    it('createID() output should be a string', () => {
        expect(createID()).to.be.a('string')
    })
})
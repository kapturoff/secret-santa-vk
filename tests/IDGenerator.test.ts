import { expect } from "chai"
import createID from "../src/helpers/IDgenerator"

describe('IDGenerator helper', () => {
    it('createID() works', () => {
        expect(createID).to.be.a('string')
    })
})
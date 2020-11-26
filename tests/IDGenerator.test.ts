import { expect } from "chai"
import createID from "../src/helpers/IDGenerator/IDGenerator"

describe('IDGenerator helper', () => {
    it('createID() works', () => {
        expect(createID).to.be.a('string')
    })
})
import { matchers } from 'jest-json-schema'

expect.extend(matchers)
jest.setTimeout(30000)

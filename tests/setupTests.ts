import '@testing-library/jest-dom'

// Polyfill TextEncoder/Decoder for node
import { TextEncoder, TextDecoder } from 'util'
// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder

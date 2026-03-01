// polyfill.ts
import { webcrypto } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = webcrypto;
}
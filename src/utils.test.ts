import { describe, it, expect } from 'vitest';
import { calculateChecksum } from './utils.js';

describe('Utility Tests', () => {
    it('should calculate correct MD5 checksum', () => {
        const input = 'hello world';
        // MD5 of "hello world" is 5eb63bbbe01eeed093cb22bb8f5acdc3
        const expected = '5eb63bbbe01eeed093cb22bb8f5acdc3';
        expect(calculateChecksum(input)).toBe(expected);
    });

    it('should return consistent checksums for same input', () => {
        const input = 'consistent';
        expect(calculateChecksum(input)).toBe(calculateChecksum(input));
    });

    it('should return different checksums for different input', () => {
        expect(calculateChecksum('a')).not.toBe(calculateChecksum('b'));
    });
    
    it('should handle empty string', () => {
         // MD5 of "" is d41d8cd98f00b204e9800998ecf8427e
        expect(calculateChecksum('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });
});

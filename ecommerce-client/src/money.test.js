// I'm basically just doing a unit testing on a function that formats money, but I want to make sure it works correctly. This is a simple test suite for the formatCurrency function

import {it, expect, describe} from "vitest";
import {formatCurrency} from './utils/money';



describe(' formatCurrency', () => {
    it('formats currency correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1234)).toBe('$12.34');
});

it('formats to two decimal places', () => {
    expect(formatCurrency(1200)).toBe('$12.00');
});
});


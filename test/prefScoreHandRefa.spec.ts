'use strict';

import PrefScoreHandRefa from '../src/prefScoreHandRefa';

describe('PrefScoreHandRefa tests', () => {
	describe('PrefScoreHandRefa classes constructors tests', () => {
		it('constructors should work', () => {
			expect(() => new PrefScoreHandRefa()).not.toThrow();
			expect(new PrefScoreHandRefa()).toBeInstanceOf(Object);
		});
	});

	describe('PrefScoreHandRefa methods tests', () => {
		const hand = new PrefScoreHandRefa();
		hand.index = 1;
		it('PrefScoreHandRefa methods should work properly', () => {
			expect(new PrefScoreHandRefa().index).toBe(0);
			expect(() => new PrefScoreHandRefa().repealed).not.toThrow();
			expect(new PrefScoreHandRefa().repealed).toBe(false);
			expect(() => (hand.repealed = true)).toThrow();
			expect(() => hand.repealed).not.toThrow();
			expect(hand.repealed).toBe(false);
			expect(hand.index).toBe(1);
			expect(hand.refa).toBe(true);
			expect(hand.game).toBe(false);
		});
	});
});

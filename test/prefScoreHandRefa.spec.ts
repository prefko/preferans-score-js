#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import PrefScoreHandRefa from '../src/prefScoreHandRefa';

describe('PrefScoreHandRefa tests', () => {

	describe('PrefScoreHandRefa classes constructors tests', () => {
		it('constructors should work', () => {
			expect(() => new PrefScoreHandRefa()).to.not.throw();
			expect(new PrefScoreHandRefa()).to.be.an('object');
		});
	});

	describe('PrefScoreHandRefa methods tests', () => {
		const hand = new PrefScoreHandRefa();
		hand.index = 1;
		it('PrefScoreHandRefa methods should work properly', () => {
			expect(new PrefScoreHandRefa().index).to.equal(0);
			expect(() => new PrefScoreHandRefa().repealed).to.not.throw();
			expect(new PrefScoreHandRefa().repealed).to.equal(false);
			expect(() => hand.repealed = true).to.throw();
			expect(() => hand.repealed).to.not.throw();
			expect(hand.repealed).to.equal(false);
			expect(hand.index).to.equal(1);
			expect(hand.refa).to.equal(true);
			expect(hand.game).to.equal(false);
		});
	});

});

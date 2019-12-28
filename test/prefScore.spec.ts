#!/usr/bin/env node
'use strict';

import { expect } from 'chai';
import PrefScore from '../src/prefScore';
import PrefScoreHandRefa from '../src/prefScoreHandRefa';
import PrefScoreHandGame from '../src/prefScoreHandGame';
import PrefPaperMain from 'preferans-paper-js/lib/prefPaperMain';
import PrefPaperFollower from 'preferans-paper-js/lib/prefPaperFollower';

describe('PrefScore tests', () => {

	describe('PrefScore classes constructors tests', () => {
		const rand = Math.ceil((Math.random() * 1000)) * 2;
		it('constructors should work', () => {
			expect(() => new PrefScore('cope', 'milja', 'mitko', rand + 1)).to.throw();
			expect(() => new PrefScore('cope', 'milja', 'mitko', rand)).to.not.throw();
			expect(new PrefScore('cope', 'milja', 'mitko', rand)).to.be.an('object');
		});
	});

	describe('PrefScore methods tests', () => {
		const json = {
			p1: { left: [], middle: [60], refas: 0, right: [], score: -600, unusedRefas: 0, username: 'cope' },
			p2: { left: [], middle: [60], refas: 0, right: [], score: -600, unusedRefas: 0, username: 'milja' },
			p3: { left: [], middle: [60], refas: 0, right: [], score: -600, unusedRefas: 0, username: 'mitko' },
		};
		const score = new PrefScore('cope', 'milja', 'mitko', 60, 0);
		score.addHand(new PrefScoreHandRefa());
		it('PrefScore methods should work properly', () => {
			expect(score.handCount).to.equal(0);
			expect(score.json).to.deep.equal(json);
			expect(() => score.hasUnplayedRefa('milan')).to.throw();
			expect(score.hasUnplayedRefa('cope')).to.equal(false);
			expect(score.hasUnplayedRefa('milja')).to.equal(false);
			expect(score.hasUnplayedRefa('mitko')).to.equal(false);
			expect(score.hasUnusedRefas()).to.equal(false);
		});

		const json2 = {
			p1: {
				left: [],
				middle: [60, { left: 0, middle: 0, right: 0 }],
				refas: Infinity,
				right: [],
				score: -600,
				unusedRefas: Infinity,
				username: 'cope',
			},
			p2: {
				left: [],
				middle: [60, { left: 0, middle: 0, right: 0 }],
				refas: Infinity,
				right: [],
				score: -600,
				unusedRefas: Infinity,
				username: 'milja',
			},
			p3: {
				left: [],
				middle: [60, { left: 0, middle: 0, right: 0 }],
				refas: Infinity,
				right: [],
				score: -600,
				unusedRefas: Infinity,
				username: 'mitko',
			},
		};
		const score2 = new PrefScore('cope', 'milja', 'mitko', 60);
		score2.addHand(new PrefScoreHandRefa());
		it('PrefScore methods should work properly', () => {
			expect(score2.handCount).to.equal(1);
			expect(score2.json).to.deep.equal(json2);
			expect(() => score2.hasUnplayedRefa('milan')).to.throw();
			expect(score2.hasUnplayedRefa('cope')).to.equal(true);
			expect(score2.hasUnplayedRefa('milja')).to.equal(true);
			expect(score2.hasUnplayedRefa('mitko')).to.equal(true);
			expect(score2.hasUnusedRefas()).to.equal(true);
		});

		const json3 = {
			p1: {
				left: [],
				middle: [60, { left: 0, middle: 0, right: 1 }, { value: 50, repealed: true }],
				refas: Infinity,
				right: [],
				score: -600,
				unusedRefas: Infinity,
				username: 'cope',
			},
			p2: {
				left: [],
				middle: [60, { left: 0, middle: 1, right: 0 }, 50],
				refas: Infinity,
				right: [{ value: 20, repealed: true }],
				score: -500,
				unusedRefas: Infinity,
				username: 'milja',
			},
			p3: {
				left: [{ value: 20, repealed: true }],
				middle: [60, { left: 1, middle: 0, right: 0 }],
				refas: Infinity,
				right: [],
				score: -600,
				unusedRefas: Infinity,
				username: 'mitko',
			},
		};
		const score3 = new PrefScore('cope', 'milja', 'mitko', 60);
		score3.addHand(new PrefScoreHandRefa());
		const main = new PrefPaperMain('cope', 6);
		const left = new PrefPaperFollower('milja', true, 2);
		const right = new PrefPaperFollower('mitko', true, 2);
		const hand = new PrefScoreHandGame(10, main, left, right);
		const main2 = new PrefPaperMain('milja', 6);
		const left2 = new PrefPaperFollower('cope', false);
		const right2 = new PrefPaperFollower('mitko', false);
		const hand2 = new PrefScoreHandGame(10, main2, left2, right2);
		score3.addHand(hand);
		score3.addHand(hand2);
		score3.repealHand(2);
		it('PrefScore methods should work properly', () => {
			expect(() => score3.repealHand(0)).to.throw();
			expect(() => score3.repealHand(17)).to.throw();
			expect(score3.handCount).to.equal(2);
			expect(score3.json).to.deep.equal(json3);
		});

		const score4 = new PrefScore('cope', 'milja', 'mitko', 60);
		score4.setName1('cope2');
		score4.setName2('milja2');
		score4.setName3('mitko2');
		it('PrefScore setName methos should work properly', () => {
			expect(() => score4.hasUnplayedRefa('cope')).to.throw();
			expect(() => score4.hasUnplayedRefa('milja')).to.throw();
			expect(() => score4.hasUnplayedRefa('mitko')).to.throw();
			expect(score4.hasUnplayedRefa('cope2')).to.equal(false);
			expect(score4.hasUnplayedRefa('milja2')).to.equal(false);
			expect(score4.hasUnplayedRefa('mitko2')).to.equal(false);
		});

	});

});

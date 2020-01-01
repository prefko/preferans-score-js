#!/usr/bin/env node
'use strict';

import { expect } from 'chai';
import PrefScore, { PrefScoreFollower, PrefScoreMain } from '../src/prefScore';

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
			p1: {
				score: -600,
				paper: { designation: 'p1', left: [], middle: [60], right: [] },
			},
			p2: {
				score: -600,
				paper: { designation: 'p2', left: [], middle: [60], right: [] },
			},
			p3: {
				score: -600,
				paper: { designation: 'p3', left: [], middle: [60], right: [] },
			},
		};
		const score = new PrefScore('cope', 'milja', 'mitko', 60, 0);
		it('PrefScore methods should work properly 1', () => {
			expect(() => score.addRefaHand()).to.throw;
			expect(score.handCount).to.equal(0);
			expect(score.json).to.deep.equal(json);
			expect(score.hasUnplayedRefa('p1')).to.equal(false);
			expect(score.hasUnplayedRefa('p2')).to.equal(false);
			expect(score.hasUnplayedRefa('p3')).to.equal(false);
			expect(score.username1).to.equal('cope');
			expect(score.username2).to.equal('milja');
			expect(score.username3).to.equal('mitko');
		});

		const json2 = {
			p1: {
				score: -600,
				paper: {
					designation: 'p1',
					left: [],
					middle: [60, { left: 0, middle: 0, right: 0 }],
					right: [],
				},
			},
			p2: {
				score: -600,
				paper: {
					designation: 'p2',
					left: [],
					middle: [60, { left: 0, middle: 0, right: 0 }],
					right: [],
				},
			},
			p3: {
				score: -600,
				paper: {
					designation: 'p3',
					left: [],
					middle: [60, { left: 0, middle: 0, right: 0 }],
					right: [],
				},
			},
		};
		const score2 = new PrefScore('cope', 'milja', 'mitko', 60);
		score2.addRefaHand();
		it('PrefScore methods should work properly 2', () => {
			expect(score2.handCount).to.equal(1);
			expect(score2.json).to.deep.equal(json2);
			expect(score2.hasUnplayedRefa('p1')).to.equal(true);
			expect(score2.hasUnplayedRefa('p2')).to.equal(true);
			expect(score2.hasUnplayedRefa('p3')).to.equal(true);
		});

		const json3 = {
			p1: {
				score: -600,
				paper: {
					designation: 'p1',
					left: [],
					middle: [
						60,
						{ left: 0, middle: 0, right: 0 },
						{ value: 50, repealed: true },
						{ value: 40, repealed: true },
					],
					right: [],
				},
			},
			p2: {
				score: -500,
				paper: {
					designation: 'p2',
					left: [{ value: 20, repealed: true }, { value: 40, repealed: true }],
					middle: [60, { left: 0, middle: 1, right: 0 }, { value: 50, repealed: true }, 50],
					right: [],
				},
			},
			p3: {
				score: -600,
				paper: {
					designation: 'p3',
					left: [],
					middle: [60, { left: 0, middle: 0, right: 0 }],
					right: [{ value: 20, repealed: true }, { value: 40, repealed: true }],
				},
			},
		};
		const mini3 = {
			p1: {
				score: -600,
				paper: { designation: 'p1', left: 0, middle: 60, right: 0 },
			},
			p2: {
				score: -500,
				paper: { designation: 'p2', left: 0, middle: 50, right: 0 },
			},
			p3: {
				score: -600,
				paper: { designation: 'p3', left: 0, middle: 60, right: 0 },
			},
		};
		const score3 = new PrefScore('cope', 'milja', 'mitko', 60, 1);
		score3.addRefaHand();
		const main: PrefScoreMain = { designation: 'p1', tricks: 6, failed: false };
		const right: PrefScoreFollower = { designation: 'p2', tricks: 2, failed: false, followed: true };
		const left: PrefScoreFollower = { designation: 'p3', tricks: 2, failed: false, followed: true };

		const main2: PrefScoreMain = { designation: 'p2', tricks: 6, failed: false };
		const right2: PrefScoreFollower = { designation: 'p3', followed: false, tricks: 0, failed: false };
		const left2: PrefScoreFollower = { designation: 'p1', followed: false, tricks: 0, failed: false };

		const main3: PrefScoreMain = { designation: 'p1', tricks: 6, failed: false };
		const right3: PrefScoreFollower = { designation: 'p2', followed: true, tricks: 2, failed: false };
		const left3: PrefScoreFollower = { designation: 'p3', followed: true, tricks: 2, failed: false };

		score3.addPlayedHand(10, main, left, right);
		score3.addPlayedHand(10, main2, left2, right2);
		score3.addPlayedHand(20, main3, left3, right3);
		score3.addPlayedHand(10, main2, left2, right2);
		score3.repealHand(2);
		score3.repealHand(3);
		score3.repealHand(4);
		it('PrefScore methods should work properly 3', () => {
			expect(() => score3.repealHand(0)).to.throw();
			expect(() => score3.repealHand(17)).to.throw();
			expect(score3.handCount).to.equal(2);
			expect(score3.mini).to.deep.equal(mini3);
			expect(score3.json).to.deep.equal(json3);
			expect(() => score3.addRefaHand()).to.throw();
		});

		const score4 = new PrefScore('cope', 'milja', 'mitko', 60, 1);
		score4.username1 = 'cope2';
		score4.username2 = 'milja2';
		score4.username3 = 'mitko2';
		it('PrefScore setName methos should work properly', () => {
			expect(() => score4.addRefaHand()).to.not.throw;
			expect(score4.hasUnplayedRefa('p1')).to.equal(false);
			expect(score4.hasUnplayedRefa('p2')).to.equal(false);
			expect(score4.hasUnplayedRefa('p3')).to.equal(false);
			expect(score4.username1).to.equal('cope2');
			expect(score4.username2).to.equal('milja2');
			expect(score4.username3).to.equal('mitko2');
		});

		const score5 = new PrefScore('cope', 'milja', 'mitko', 60, Infinity);
		it('PrefScore setName methos should work properly', () => {
			expect(() => score5.addRefaHand()).to.not.throw;
		});
	});

});

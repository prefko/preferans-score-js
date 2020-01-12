#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import PrefScoreHandGame from '../src/prefScoreHandGame';
import {PrefScoreFollower, PrefScoreMain} from "../src/prefScore.types";

describe('PrefScoreHandGame tests', () => {

	describe('PrefScoreHandGame classes constructors tests', () => {
		const main: PrefScoreMain = {designation: 'p1', tricks: 6, failed: false};
		const left: PrefScoreFollower = {designation: 'p2', tricks: 2, failed: false, followed: true};
		const right: PrefScoreFollower = {designation: 'p3', tricks: 2, failed: false, followed: true};
		it('constructors should work', () => {
			expect(() => new PrefScoreHandGame(10, main, left, right)).to.not.throw();
			expect(new PrefScoreHandGame(10, main, left, right)).to.be.an('object');
		});
	});

	describe('PrefScoreHandGame methods tests', () => {
		const main: PrefScoreMain = {designation: 'p1', tricks: 6, failed: false};
		const left: PrefScoreFollower = {designation: 'p2', tricks: 2, failed: false, followed: true};
		const right: PrefScoreFollower = {designation: 'p3', tricks: 2, failed: false, followed: true};
		const hand = new PrefScoreHandGame(10, main, left, right);
		hand.index = 1;
		hand.repealed = true;
		it('PrefScoreHandGame methods should work properly', () => {
			expect(new PrefScoreHandGame(10, main, left, right).index).to.equal(0);
			expect(new PrefScoreHandGame(10, main, left, right).repealed).to.equal(false);
			expect(hand.index).to.equal(1);
			expect(hand.repealed).to.equal(true);
			expect(hand.refa).to.equal(false);
			expect(hand.game).to.equal(true);
		});
	});

	describe('PrefScoreHandGame methods tests', () => {
		const main: PrefScoreMain = {designation: 'p1', tricks: 6, failed: false};
		const mainFailed: PrefScoreMain = {designation: 'p1', tricks: 5, failed: true};
		const mainFailed2: PrefScoreMain = {designation: 'p1', tricks: 6, failed: true};
		const mainWrong: PrefScoreMain = {designation: 'p1', tricks: 5, failed: true};

		const left: PrefScoreFollower = {designation: 'p2', tricks: 2, failed: false, followed: true};
		const leftFailed: PrefScoreFollower = {designation: 'p2', tricks: 3, failed: true, followed: true};
		const leftFailed2: PrefScoreFollower = {designation: 'p2', tricks: 2, failed: true, followed: true};
		const leftWrong: PrefScoreFollower = {designation: 'p2', tricks: 4, failed: false, followed: true};

		const right: PrefScoreFollower = {designation: 'p3', tricks: 2, failed: false, followed: true};
		const rightFailed: PrefScoreFollower = {designation: 'p3', tricks: 3, failed: true, followed: true};
		const rightFailed2: PrefScoreFollower = {designation: 'p3', tricks: 2, failed: true, followed: true};
		const rightWrong: PrefScoreFollower = {designation: 'p3', tricks: 4, failed: false, followed: true};

		const game = new PrefScoreHandGame(10, main, left, right);
		it('PrefScoreHandGame methods should work properly', () => {
			expect(() => new PrefScoreHandGame(10, mainWrong, left, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed2, left, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftWrong, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, left, rightWrong)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftWrong, rightWrong)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftFailed, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, left, rightFailed)).to.throw();
			expect(() => new PrefScoreHandGame(10, main, leftFailed2, rightFailed2)).to.not.throw();
			expect(game.value).to.equal(10);
			expect(game.main).to.deep.equal(main);
			expect(game.left).to.deep.equal(left);
			expect(game.right).to.deep.equal(right);
		});
	});

});

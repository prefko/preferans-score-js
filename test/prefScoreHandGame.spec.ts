#!/usr/bin/env node
"use strict";

import {expect} from 'chai';
import PrefScoreHandGame from "../src/prefScoreHandGame";
import PrefPaperMain from "preferans-paper-js/lib/prefPaperMain";
import PrefPaperFollower from "preferans-paper-js/lib/prefPaperFollower";

describe("PrefScore tests", () => {

	describe("PrefScore classes constructors tests", () => {
		const main = new PrefPaperMain("cope", 6);
		const left = new PrefPaperFollower("milja", true, 2);
		const right = new PrefPaperFollower("mitko", true, 2);
		it("constructors should work", () => {
			expect(() => new PrefScoreHandGame(10, main, left, right)).to.not.throw();
			expect(new PrefScoreHandGame(10, main, left, right)).to.be.an("object");
		});
	});

	describe("PrefScoreHand methods tests", () => {
		const main = new PrefPaperMain("cope", 6);
		const left = new PrefPaperFollower("milja", true, 2);
		const right = new PrefPaperFollower("mitko", true, 2);
		const hand = new PrefScoreHandGame(10, main, left, right);
		hand.index = 1;
		hand.repealed = true;
		it("PrefScoreHand methods should work properly", () => {
			expect(new PrefScoreHandGame(10, main, left, right).index).to.be.equal(0);
			expect(new PrefScoreHandGame(10, main, left, right).repealed).to.be.equal(false);
			expect(hand.index).to.be.equal(1);
			expect(hand.repealed).to.be.equal(true);
			expect(hand.refa).to.be.equal(false);
			expect(hand.game).to.be.equal(true);
		});
	});

	describe("PrefScoreHandGame methods tests", () => {
		const main = new PrefPaperMain("cope", 6);
		const mainFailed = new PrefPaperMain("cope", 5, true);
		const mainFailed2 = new PrefPaperMain("cope", 6, true);
		const mainWrong = new PrefPaperMain("cope", 5, true);
		const left = new PrefPaperFollower("milja", true, 2);
		const leftFailed = new PrefPaperFollower("milja", true, 3, true);
		const leftFailed2 = new PrefPaperFollower("milja", true, 2, true);
		const leftWrong = new PrefPaperFollower("milja", true, 4);
		const right = new PrefPaperFollower("mitko", true, 2);
		const rightFailed = new PrefPaperFollower("mitko", true, 3, true);
		const rightFailed2 = new PrefPaperFollower("mitko", true, 2, true);
		const rightWrong = new PrefPaperFollower("mitko", true, 4);
		const game = new PrefScoreHandGame(10, main, left, right);
		it("PrefScoreHandGame methods should work properly", () => {
			expect(() => new PrefScoreHandGame(10, mainWrong, left, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed2, left, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftWrong, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, left, rightWrong)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftWrong, rightWrong)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, leftFailed, right)).to.throw();
			expect(() => new PrefScoreHandGame(10, mainFailed, left, rightFailed)).to.throw();
			expect(() => new PrefScoreHandGame(10, main, leftFailed2, rightFailed2)).to.not.throw();
			expect(game.value).to.be.equal(10);
			expect(game.main).to.deep.equal(main);
			expect(game.left).to.deep.equal(left);
			expect(game.right).to.deep.equal(right);
		});
	});

});

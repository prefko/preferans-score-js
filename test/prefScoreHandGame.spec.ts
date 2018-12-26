#!/usr/bin/env node
"use strict";

import {expect} from 'chai';
import PrefScoreHandGame from "../src/prefScoreHandGame";
import PrefPaperMain from "preferans-paper-js/lib/prefPaperMain";
import PrefPaperFollower from "preferans-paper-js/lib/prefPaperFollower";

describe("PrefScore tests", () => {

	describe("PrefScore classes constructors tests", () => {
		let main = new PrefPaperMain("cope", 6);
		let left = new PrefPaperFollower("milja", true, 2);
		let right = new PrefPaperFollower("mitko", true, 2);
		it("constructors should work", () => {
			expect(() => new PrefScoreHandGame(10, main, left, right)).to.not.throw();
			expect(new PrefScoreHandGame(10, main, left, right)).to.be.an("object");
		});
	});

	describe("PrefScoreHand methods tests", () => {
		let main = new PrefPaperMain("cope", 6);
		let left = new PrefPaperFollower("milja", true, 2);
		let right = new PrefPaperFollower("mitko", true, 2);
		let hand = new PrefScoreHandGame(10, main, left, right);
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
		let main = new PrefPaperMain("cope", 6);
		let mainFailed = new PrefPaperMain("cope", 5, true);
		let mainFailed2 = new PrefPaperMain("cope", 6, true);
		let mainWrong = new PrefPaperMain("cope", 5, true);
		let left = new PrefPaperFollower("milja", true, 2);
		let leftFailed = new PrefPaperFollower("milja", true, 3, true);
		let leftFailed2 = new PrefPaperFollower("milja", true, 2, true);
		let leftWrong = new PrefPaperFollower("milja", true, 4);
		let right = new PrefPaperFollower("mitko", true, 2);
		let rightFailed = new PrefPaperFollower("mitko", true, 3, true);
		let rightFailed2 = new PrefPaperFollower("mitko", true, 2, true);
		let rightWrong = new PrefPaperFollower("mitko", true, 4);
		let game = new PrefScoreHandGame(10, main, left, right);
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

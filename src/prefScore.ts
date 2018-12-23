#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefPaper from 'preferans-paper-js';
import PrefPaperHand from './prefScoreHand';
import PrefScoreHand from "./prefScoreHand";
import PrefScoreHandGame from "./prefScoreHandGame";
import PrefPaperFollower from "preferans-paper-js/lib/prefPaperFollower";
import PrefPaperMain from "preferans-paper-js/lib/prefPaperMain";

// TODO
const validTricks = (main: PrefPaperMain, left: PrefPaperFollower, right: PrefPaperFollower): boolean => {
	let tricks = _.get(left, "tricks", 0) + _.get(right, "tricks", 0);
	return _.get(main, "failed", false) ? tricks === 5 : tricks < 5;
};

// TODO
const invalidFails = (main: PrefPaperMain, left: PrefPaperFollower, right: PrefPaperFollower) => {
	return _.get(main, "failed", false) && (_.get(left, "failed", false) || _.get(right, "failed", false));
};

// TODO: MOVE to PrefScore
export default class PrefScore {
	private _p1: PrefPaper;
	private _p2: PrefPaper;
	private _p3: PrefPaper;
	private readonly _bula: number;
	private readonly _refas: number = Infinity;
	private _unusedRefas: number = Infinity;
	private readonly _hands: PrefPaperHand[];

	constructor(name1: string, name2: string, name3: string, bula: number, refas?: number) {
		this._hands = [];
		this._bula = bula;
		if (_.isNumber(refas) && refas >= 0 && refas < Infinity) {
			this._refas = refas;
			this._unusedRefas = refas;
		}

		this._p1 = new PrefPaper(name1, bula, this._refas);
		this._p2 = new PrefPaper(name2, bula, this._refas);
		this._p3 = new PrefPaper(name3, bula, this._refas);
	}

	get handCount(): number {
		return _.size(this._hands);
	}

	// TODO...
	getPaperByUsername(username: string) {
		let id = _.findKey(this, (attr) => attr.username === username);
		if (id) return _.get(this, id);
		throw new Error("PrefPapers::getPaperByUsername:Paper not found for username " + username);
	}

	static isValidHand(hand: PrefScoreHandGame): boolean {
		const {main, left, right} = hand;
		return validTricks(main, left, right) && !invalidFails(main, left, right);
	}

	addHand(hand: PrefPaperHand): PrefScore {
		let id = _.size(this._hands) + 1;
		this._hands.set(id, hand);
		return this.processHand(hand);
	}

	changeHand(id: number, hand: PrefPaperHand): PrefScore {
		let index = _.findIndex(this._hands, {id});
		if (!this._hands[index]) throw new Error("PrefPapers::changeHand:Hand not found with id " + id);
		if (!PrefScore.isValidHand(hand)) throw new Error("PrefPapers::changeHand:Hand is not valid " + JSON.stringify(hand));

		hand.original = _.clone(this._hands[index]);
		this._hands[index] = hand;
		this._hands[index].id = id;

		return this.recalculate();
	}

	repealHand(id: number): PrefScore {
		let index = _.findIndex(this._hands, {id});
		if (!this._hands[index]) throw new Error("PrefPapers::repealHand:Hand not found with id " + id);
		this._hands[index].repealed = true;
		return this.recalculate();
	}

	recalculate(): PrefScore {
		this._unusedRefas = this._refas;
		this._p1.reset();
		this._p2.reset();
		this._p3.reset();

		for (let hand of this._hands) this.processHand(hand);
		return this;
	}

	processHand(hand: PrefPaperHand) {
		let {value, main = {}, left = {}, right = {}, newRefa = false, repealed = false} = hand;
		main.failed = true === main.failed;

		if (newRefa) {
			if (true === repealed) {
				throw new Error("PrefScore::processHand:Invalid instructions! Cannot have a new refa repealed hand.");
			}
			return this.processNewRefa();
		}

		let mainPaper = this.getPaperByUsername(main.username);
		let leftPaper = this.getPaperByUsername(left.username);
		let rightPaper = this.getPaperByUsername(right.username);

		if (true !== repealed) {
			mainPaper.markMePlayedRefa(main.failed);
			leftPaper.markRightPlayedRefa(main.failed);
			rightPaper.markLeftPlayedRefa(main.failed);

			mainPaper.addMiddleValue(main.failed ? value : -value);
			leftPaper.processFollowing(_.merge({}, left, {value, mainPosition: "right"}));
			rightPaper.processFollowing(_.merge({}, right, {value, mainPosition: "left"}));

			mainPaper.calculateScore(leftPaper.getRightValue(), rightPaper.getLeftValue());
			leftPaper.calculateScore(rightPaper.getRightValue(), mainPaper.getLeftValue());
			rightPaper.calculateScore(mainPaper.getRightValue(), leftPaper.getLeftValue());

		} else {
			mainPaper.addMiddleValue(main.failed ? value : -value, true);
			leftPaper.processFollowing(_.merge({}, left, {value, mainPosition: "right", repealed}));
			rightPaper.processFollowing(_.merge({}, right, {value, mainPosition: "left", repealed}));
		}

		return this;
	}

	processNewRefa() {
		if (this._refas > 0 && this._unusedRefas <= 0) throw new Error("PrefPapers::processNewRefa:All refas have been used " + this._refas);

		this._unusedRefas--;
		this.p1.newRefa(true);
		this.p2.newRefa(true);
		this.p3.newRefa(true);

		return this;
	}

	get json() {
		return {
			p1: this._p1.json,
			p2: this._p2.json,
			p3: this._p3.json
		};
	}

	// TODO: moved from paper
	// calculateScore(leftValue = 0, rightValue = 0): PrefPaper {
	// 	let tmp = this.score;
	// 	this.score = this.getLeftValue() + this.getRightValue() - (this.getMiddleValue() * 10) - leftValue - rightValue;
	// 	return this;
	// }

}

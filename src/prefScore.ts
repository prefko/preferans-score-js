#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import PrefPaper from 'preferans-paper-js';
import PrefScoreHand from './prefScoreHand';
import PrefScoreHandGame from "./prefScoreHandGame";
import {PrefPaperPosition} from "preferans-paper-js/lib/prefPaperEnums";

export default class PrefScore {
	private readonly _p1: PrefPaper;
	private readonly _p2: PrefPaper;
	private readonly _p3: PrefPaper;
	private readonly _bula: number;
	private readonly _hands: Map<number, PrefScoreHand>;

	constructor(name1: string, name2: string, name3: string, bula: number, refas: number = Infinity) {
		this._hands = new Map<number, PrefScoreHand>();
		this._bula = bula;

		this._p1 = new PrefPaper(name1, bula, refas);
		this._p2 = new PrefPaper(name2, bula, refas);
		this._p3 = new PrefPaper(name3, bula, refas);
	}

	public addHand(hand: PrefScoreHand): PrefScore {
		let index = _.size(this._hands) + 1;
		hand.index = index;
		this._hands.set(index, hand);
		return this.processHand(hand);
	}

	public repealHand(index: number): PrefScore {
		let hand = this._hands.get(index);
		if (hand) {
			hand.repealed = true;
			this._hands.set(index, hand);
			return this.recalculate();
		}
		throw new Error("PrefPapers::repealHand:Hand not found with index " + index);
	}

	private recalculate(): PrefScore {
		this._p1.reset();
		this._p2.reset();
		this._p3.reset();

		for (let hand of this._hands) this.processHand(hand[1]);

		return this;
	}

	public processHand(hand: PrefScoreHand) {
		if (true === hand.refa) return this.processNewRefa();

		let game = hand as PrefScoreHandGame;
		let mainPaper = this.getPaperByUsername(game.main.username);
		let leftPaper = this.getPaperByUsername(game.left.username);
		let rightPaper = this.getPaperByUsername(game.right.username);

		let value = game.value;
		let mainPassed = !game.main.failed;
		if (!game.repealed) {
			mainPaper.processMain(game.main, value, false);
			leftPaper.processFollowing(game.left, value, mainPassed, PrefPaperPosition.RIGHT, false);
			rightPaper.processFollowing(game.right, value, mainPassed, PrefPaperPosition.LEFT, false);

			mainPaper.calculateScore(leftPaper.right, rightPaper.left);
			leftPaper.calculateScore(rightPaper.right, mainPaper.left);
			rightPaper.calculateScore(mainPaper.right, leftPaper.left);

		} else {
			mainPaper.processMain(game.main, value, true);
			leftPaper.processFollowing(game.left, value, mainPassed, PrefPaperPosition.RIGHT, true);
			rightPaper.processFollowing(game.right, value, mainPassed, PrefPaperPosition.LEFT, true);
		}

		return this;
	}

	public hasUnplayedRefa(username: string): boolean {
		return this.getPaperByUsername(username).hasUnplayedRefa();
	}

	get handCount(): number {
		return _.size(this._hands);
	}

	get json() {
		return {
			p1: this._p1.json,
			p2: this._p2.json,
			p3: this._p3.json
		};
	}

	private getPaperByUsername(username: string): PrefPaper {
		if (this._p1.username === username) return this._p1;
		if (this._p2.username === username) return this._p2;
		if (this._p3.username === username) return this._p3;
		throw new Error("PrefPapers::getPaperByUsername:Paper not found for username " + username);
	}

	private processNewRefa() {
		if (this._p1.hasUnusedRefas()) {
			this._p1.addNewRefa();
			this._p2.addNewRefa();
			this._p3.addNewRefa();
		}

		return this;
	}

}

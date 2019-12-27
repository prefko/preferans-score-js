#!/usr/bin/env node
'use strict';

import { size } from 'lodash';
import PrefPaper from 'preferans-paper-js';
import PrefScoreHand from './prefScoreHand';
import PrefScoreHandGame from './prefScoreHandGame';
import { PrefPaperPosition } from 'preferans-paper-js/lib/prefPaperEnums';

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
		if (!!hand.refa && !this._p1.hasUnusedRefas()) return this;

		const index = size(this._hands) + 1;
		hand.index = index;
		this._hands.set(index, hand);
		return this.processHand(hand);
	}

	public repealHand(index: number): PrefScore {
		if (index > 0) {
			const hand = this._hands.get(index);
			if (hand) {
				hand.repealed = true;
				this._hands.set(index, hand);
				return this.recalculate();
			}
		}
		throw new Error('PrefPapers::repealHand:Hand not found with index ' + index);
	}

	public hasUnplayedRefa(username: string): boolean {
		return this.getPaperByUsername(username).hasUnplayedRefa();
	}

	get handCount(): number {
		let cnt = 0;
		for (const m of this._hands) {
			if (m[1].refa) cnt++;
			else {
				const h = m[1] as PrefScoreHandGame;
				if (!h.repealed) cnt++;
			}
		}
		return cnt;
	}

	get json() {
		return {
			p1: this._p1.json,
			p2: this._p2.json,
			p3: this._p3.json,
		};
	}

	private recalculate(): PrefScore {
		this._p1.reset();
		this._p2.reset();
		this._p3.reset();

		for (const hand of this._hands) this.processHand(hand[1]);

		return this;
	}

	private processHand(hand: PrefScoreHand) {
		if (!!hand.refa) return this.processNewRefa();

		const playedHand = hand as PrefScoreHandGame;
		const mainPaper = this.getPaperByUsername(playedHand.main.username);
		const leftPaper = this.getPaperByUsername(playedHand.left.username);
		const rightPaper = this.getPaperByUsername(playedHand.right.username);

		const value = playedHand.value;
		const mainPassed = !playedHand.main.failed;

		mainPaper.processMain(playedHand.main, value, playedHand.repealed);
		leftPaper.processFollowing(playedHand.left, value, mainPassed, PrefPaperPosition.RIGHT, playedHand.repealed);
		rightPaper.processFollowing(playedHand.right, value, mainPassed, PrefPaperPosition.LEFT, playedHand.repealed);

		mainPaper.calculateScore(leftPaper.right, rightPaper.left);
		leftPaper.calculateScore(rightPaper.right, mainPaper.left);
		rightPaper.calculateScore(mainPaper.right, leftPaper.left);

		return this;
	}

	private getPaperByUsername(username: string): PrefPaper {
		if (this._p1.username === username) return this._p1;
		if (this._p2.username === username) return this._p2;
		if (this._p3.username === username) return this._p3;
		throw new Error('PrefPapers::getPaperByUsername:Paper not found for username ' + username);
	}

	private processNewRefa() {
		this._p1.addNewRefa();
		this._p2.addNewRefa();
		this._p3.addNewRefa();
		return this;
	}

}

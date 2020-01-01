#!/usr/bin/env node
'use strict';

import { size } from 'lodash';
import PrefPaper, { PrefPaperPosition } from 'preferans-paper-js';
import PrefScoreHand from './prefScoreHand';
import PrefScoreHandGame from './prefScoreHandGame';
import PrefScoreHandRefa from './prefScoreHandRefa';

export { PrefScoreHand, PrefScoreHandGame, PrefScoreHandRefa };

export default class PrefScore {
	private readonly _p1: PrefPaper;
	private readonly _p2: PrefPaper;
	private readonly _p3: PrefPaper;

	private _p1username: string;
	private _p2username: string;
	private _p3username: string;

	private readonly _bula: number;
	private readonly _hands: Map<number, PrefScoreHand>;

	constructor(p1username: string, p2username: string, p3username: string, bula: number, refas: number = Infinity) {
		this._hands = new Map<number, PrefScoreHand>();
		this._bula = bula;

		this._p1username = p1username;
		this._p2username = p2username;
		this._p3username = p3username;

		this._p1 = new PrefPaper('p1', bula, refas);
		this._p2 = new PrefPaper('p2', bula, refas);
		this._p3 = new PrefPaper('p3', bula, refas);
	}

	public addHand(hand: PrefScoreHand): PrefScore {
		if (hand.refa && !this._p1.hasUnusedRefas()) return this;

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

	public hasUnusedRefas(): boolean {
		return this._p1.hasUnusedRefas();
	}

	public hasUnplayedRefa(designation: 'p1' | 'p2' | 'p3'): boolean {
		return this.getPaperByDesignation(designation).hasUnplayedRefa();
	}

	get username1(): string {
		return this._p1username;
	}

	set username1(name1: string) {
		this._p1username = name1;
	}

	get username2(): string {
		return this._p2username;
	}

	set username2(name2: string) {
		this._p2username = name2;
	}

	get username3(): string {
		return this._p3username;
	}

	set username3(name3: string) {
		this._p3username = name3;
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
		if (hand.refa) return this.processNewRefa();

		const playedHand = hand as PrefScoreHandGame;
		const mainPaper = this.getPaperByDesignation(playedHand.main.designation);
		const leftPaper = this.getPaperByDesignation(playedHand.left.designation);
		const rightPaper = this.getPaperByDesignation(playedHand.right.designation);

		const value = playedHand.value;
		const mainPassed = !playedHand.main.failed;

		mainPaper.processAsMain(playedHand.main, value, playedHand.repealed);
		leftPaper.processFollower(playedHand.left, value, mainPassed, PrefPaperPosition.RIGHT, playedHand.repealed);
		rightPaper.processFollower(playedHand.right, value, mainPassed, PrefPaperPosition.LEFT, playedHand.repealed);

		mainPaper.calculateScore(leftPaper.right, rightPaper.left);
		leftPaper.calculateScore(rightPaper.right, mainPaper.left);
		rightPaper.calculateScore(mainPaper.right, leftPaper.left);

		return this;
	}

	private getPaperByDesignation(designation: 'p1' | 'p2' | 'p3'): PrefPaper {
		if (this._p1.designation === designation) return this._p1;
		if (this._p2.designation === designation) return this._p2;
		return this._p3;
	}

	private processNewRefa() {
		this._p1.addNewRefa();
		this._p2.addNewRefa();
		this._p3.addNewRefa();
		return this;
	}

}

#!/usr/bin/env node
'use strict';

import {size} from 'lodash';
import PrefPaper from 'preferans-paper-js';
import PrefScoreHand from './prefScoreHand';
import PrefScoreHandGame from './prefScoreHandGame';
import PrefScoreHandRefa from './prefScoreHandRefa';
import {PrefDesignation, PrefScoreMain, PrefScoreFollower} from "./prefScore.types";

export {PrefScoreMain, PrefScoreFollower};

export default class PrefScore {
	private readonly _p1: PrefPaper;
	private readonly _p2: PrefPaper;
	private readonly _p3: PrefPaper;

	private _p1username: string;
	private _p2username: string;
	private _p3username: string;

	private _p1score: number;
	private _p2score: number;
	private _p3score: number;

	private readonly _bula: number;
	private readonly _refas: number;
	private _usedRefas: number;
	private readonly _hands: Map<number, PrefScoreHand>;

	constructor(p1username: string, p2username: string, p3username: string, bula: number, refas: number = Infinity) {
		this._hands = new Map<number, PrefScoreHand>();
		this._bula = bula;
		this._refas = refas;
		this._usedRefas = 0;

		this._p1username = p1username;
		this._p2username = p2username;
		this._p3username = p3username;

		this._p1score = -this._bula * 10;
		this._p2score = -this._bula * 10;
		this._p3score = -this._bula * 10;

		this._p1 = new PrefPaper('p1', bula);
		this._p2 = new PrefPaper('p2', bula);
		this._p3 = new PrefPaper('p3', bula);
	}

	public addRefaHand(): PrefScore {
		if (!this._hasUnusedRefas()) throw new Error('PrefScore::addRefaHand:No more unused refas!');

		const hand = new PrefScoreHandRefa();
		const index = size(this._hands) + 1;
		hand.index = index;
		this._hands.set(index, hand);
		this._usedRefas++;
		return this._processHand(hand);
	}

	public addPlayedHand(value: number, main: PrefScoreMain, left: PrefScoreFollower, right: PrefScoreFollower): PrefScore {
		const hand = new PrefScoreHandGame(value, main, left, right);
		const index = size(this._hands) + 1;
		hand.index = index;
		this._hands.set(index, hand);
		return this._processHand(hand);
	}

	public repealHand(index: number): PrefScore {
		if (index > 0) {
			const hand = this._hands.get(index);
			if (hand) {
				hand.repealed = true;
				this._hands.set(index, hand);
				return this._recalculate();
			}
		}
		throw new Error('PrefPapers::repealHand:Hand not found with index ' + index);
	}

	public hasUnplayedRefa(designation: PrefDesignation): boolean {
		return this.getPaper(designation).hasUnplayedRefa();
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

	get mini() {
		return {
			p1: {score: this._p1score, paper: this._p1.mini},
			p2: {score: this._p2score, paper: this._p2.mini},
			p3: {score: this._p3score, paper: this._p3.mini},
		};
	}

	get json() {
		return {
			p1: {score: this._p1score, paper: this._p1.json},
			p2: {score: this._p2score, paper: this._p2.json},
			p3: {score: this._p3score, paper: this._p3.json},
		};
	}

	public getPaper(designation: PrefDesignation): PrefPaper {
		if (this._p1.designation === designation) return this._p1;
		if (this._p2.designation === designation) return this._p2;
		return this._p3;
	}

	private _recalculate(): PrefScore {
		this._p1.reset();
		this._p2.reset();
		this._p3.reset();

		this._p1score = -this._bula * 10;
		this._p2score = -this._bula * 10;
		this._p3score = -this._bula * 10;

		for (const hand of this._hands) this._processHand(hand[1]);

		return this;
	}

	private _hasUnusedRefas(): boolean {
		if (Infinity === this._refas) return true;
		return this._refas - this._usedRefas > 0;
	}

	private _processHand(hand: PrefScoreHand) {
		if (hand.refa) return this._processNewRefa();

		const playHand = hand as PrefScoreHandGame;

		const main = playHand.main;
		const left = playHand.left;
		const right = playHand.right;
		const value = playHand.value;

		const mainPaper = this.getPaper(main.designation);
		const leftPaper = this.getPaper(left.designation);
		const rightPaper = this.getPaper(right.designation);

		if (playHand.repealed) {
			mainPaper.processAsMainRepealed(value, main.designation, main.failed);
			if (left.followed) leftPaper.processAsFollowerRepealed(value, left.designation, left.tricks, left.failed, main.designation);
			if (right.followed) rightPaper.processAsFollowerRepealed(value, right.designation, right.tricks, right.failed, main.designation);

		} else {
			mainPaper.processAsMain(value, main.designation, main.failed);
			if (left.followed) leftPaper.processAsFollower(value, left.designation, left.tricks, left.failed, main.designation);
			if (right.followed) rightPaper.processAsFollower(value, right.designation, right.tricks, right.failed, main.designation);

			let mainScore: number = this._getScoreByDesignation(main.designation);
			let leftScore: number = this._getScoreByDesignation(left.designation);
			let rightScore: number = this._getScoreByDesignation(right.designation);

			mainScore = mainPaper.left + mainPaper.right - (mainPaper.middle * 10) - leftPaper.right - rightPaper.left;
			leftScore = leftPaper.left + leftPaper.right - (leftPaper.middle * 10) - rightPaper.right - mainPaper.left;
			rightScore = rightPaper.left + rightPaper.right - (rightPaper.middle * 10) - mainPaper.right - leftPaper.left;

			this._setScoreByDesignation(main.designation, mainScore);
			this._setScoreByDesignation(left.designation, leftScore);
			this._setScoreByDesignation(right.designation, rightScore);
		}

		return this;
	}

	private _getScoreByDesignation(designation: PrefDesignation): number {
		if (this._p1.designation === designation) return this._p1score;
		if (this._p2.designation === designation) return this._p2score;
		return this._p3score;
	}

	private _setScoreByDesignation(designation: PrefDesignation, score: number): void {
		if (this._p1.designation === designation) this._p1score = score;
		else if (this._p2.designation === designation) this._p2score = score;
		else this._p3score = score;
	}

	private _processNewRefa() {
		this._p1.addNewRefa();
		this._p2.addNewRefa();
		this._p3.addNewRefa();
		return this;
	}

}

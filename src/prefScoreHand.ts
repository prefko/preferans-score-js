#!/usr/bin/env node
"use strict";

import {PrefPaperPlayerFollower, PrefPaperPlayerMain} from "./prefPaperPlayer";

// TODO: MOVE to PrefScore
export default abstract class PrefScoreHand {
	protected _repealed = false;

	protected constructor() {
	}

	get repealed() {
		return this._repealed;
	}

	set repealed(repealed: boolean) {
		this._repealed = repealed;
	}

	get refa() {
		return false;
	}

	get played() {
		return false;
	}
}

export class PrefScoreHandRefa extends PrefScoreHand {
	constructor() {
		super();
	}

	get refa() {
		return true;
	}
}

export class PrefScoreHandPlayed extends PrefScoreHand {
	private _value: number;
	private _left: PrefPaperPlayerFollower;
	private _middle: PrefPaperPlayerMain;
	private _right: PrefPaperPlayerFollower;

	constructor(value: number, left: PrefPaperPlayerFollower, middle: PrefPaperPlayerMain, right: PrefPaperPlayerFollower) {
		super();

		this._value = value;
		this._left = left;
		this._middle = middle;
		this._right = right;
	}

	get played() {
		return true;
	}
}

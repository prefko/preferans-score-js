#!/usr/bin/env node
"use strict";

import PrefScoreHand from "./prefScoreHand";
import PrefPaperFollower from "preferans-paper-js/lib/prefPaperFollower";
import PrefPaperMain from "preferans-paper-js/lib/prefPaperMain";

export default class PrefScoreHandGame extends PrefScoreHand {
	private _value: number;
	private _left: PrefPaperFollower;
	private _main: PrefPaperMain;
	private _right: PrefPaperFollower;

	constructor(value: number, left: PrefPaperFollower, main: PrefPaperMain, right: PrefPaperFollower) {
		super();

		this._value = value;
		this._left = left;
		this._main = main;
		this._right = right;
	}

	get value(): number {
		return this._value;
	}

	get left(): PrefPaperFollower {
		return this._left;
	}

	get main(): PrefPaperMain {
		return this._main;
	}

	get right(): PrefPaperFollower {
		return this._right;
	}

	get game() {
		return true;
	}
}

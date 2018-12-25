#!/usr/bin/env node
"use strict";

export default abstract class PrefScoreHand {
	protected _index: number = 0;
	protected _repealed: boolean = false;

	set index(index: number) {
		this._index = index;
	}

	set repealed(repealed: boolean) {
		this._repealed = repealed;
	}

	get index() {
		return this._index;
	}

	get repealed() {
		return this._repealed;
	}

	get refa() {
		return false;
	}

	get game() {
		return false;
	}
}

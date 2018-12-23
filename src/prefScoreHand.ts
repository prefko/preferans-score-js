#!/usr/bin/env node
"use strict";

export default abstract class PrefScoreHand {
	protected _repealed: boolean = false;

	get repealed() {
		return this._repealed;
	}

	set repealed(repealed: boolean) {
		this._repealed = repealed;
	}

	get refa() {
		return false;
	}

	get game() {
		return false;
	}
}

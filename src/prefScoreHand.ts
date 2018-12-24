#!/usr/bin/env node
"use strict";

export default abstract class PrefScoreHand {
	protected _id: number;
	protected _repealed: boolean = false;

	constructor(id: number) {
		this._id = id;
	}

	set id(id: number) {
		this._id = id;
	}

	set repealed(repealed: boolean) {
		this._repealed = repealed;
	}

	get id() {
		return this._id;
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

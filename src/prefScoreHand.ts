'use strict';

export default abstract class PrefScoreHand {
	protected _index: number = 0;
	protected _repealed: boolean = false;

	get index() {
		return this._index;
	}

	set index(index: number) {
		this._index = index;
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

	get game() {
		return false;
	}
}

#!/usr/bin/env node
'use strict';

import PrefScoreHand from './prefScoreHand';
import PrefPaperFollower from 'preferans-paper-js/lib/prefPaperFollower';
import PrefPaperMain from 'preferans-paper-js/lib/prefPaperMain';

const validTricks = (main: PrefPaperMain, left: PrefPaperFollower, right: PrefPaperFollower): boolean => {
	if (main.failed && main.tricks > 5) return false;
	const tricks = left.tricks + right.tricks;
	return main.failed ? tricks === 5 : tricks < 5;
};

const validFails = (main: PrefPaperMain, left: PrefPaperFollower, right: PrefPaperFollower): boolean => {
	return !(main.failed && (left.failed || right.failed));
};

export default class PrefScoreHandGame extends PrefScoreHand {
	private readonly _value: number;
	private readonly _left: PrefPaperFollower;
	private readonly _main: PrefPaperMain;
	private readonly _right: PrefPaperFollower;

	constructor(value: number, main: PrefPaperMain, left: PrefPaperFollower, right: PrefPaperFollower) {
		if (!validTricks(main, left, right)) {
			throw new Error('PrefScoreHandGame::constructor:Invalid tricks! ' +
				'[main:' + main.tricks + ', left:' + left.tricks + ', right:' + right.tricks + ']');
		}

		if (!validFails(main, left, right)) {
			throw new Error('PrefScoreHandGame::constructor:Invalid fails! ' +
				'[main.failed:' + main.failed + ', left.failed:' + left.failed + ', right.failed:' + right.failed + ']');
		}

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

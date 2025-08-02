'use strict';

import PrefScoreHand from './pref.score.hand';
import {PrefScoreFollower, PrefScoreMain} from './pref.score.types';

const _validTricks = (main: PrefScoreMain, left: PrefScoreFollower, right: PrefScoreFollower): boolean => {
	if (main.failed && main.tricks > 5) return false;
	const tricks = left.tricks + right.tricks;
	return main.failed ? tricks === 5 : tricks < 5;
};

const _validFails = (main: PrefScoreMain, left: PrefScoreFollower, right: PrefScoreFollower): boolean => !(main.failed && (left.failed || right.failed));

export default class PrefScoreHandGame extends PrefScoreHand {
	private readonly _value: number;
	private readonly _left: PrefScoreFollower;
	private readonly _main: PrefScoreMain;
	private readonly _right: PrefScoreFollower;

	constructor(value: number, main: PrefScoreMain, left: PrefScoreFollower, right: PrefScoreFollower) {
		if (!_validTricks(main, left, right)) {
			throw new Error('PrefScoreHandGame::constructor:Invalid tricks! ' + '[main:' + main.tricks + ', left:' + left.tricks + ', right:' + right.tricks + ']');
		}

		if (!_validFails(main, left, right)) {
			throw new Error('PrefScoreHandGame::constructor:Invalid fails! ' + '[main.failed:' + main.failed + ', left.failed:' + left.failed + ', right.failed:' + right.failed + ']');
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

	get left(): PrefScoreFollower {
		return this._left;
	}

	get main(): PrefScoreMain {
		return this._main;
	}

	get right(): PrefScoreFollower {
		return this._right;
	}

	get game() {
		return true;
	}
}

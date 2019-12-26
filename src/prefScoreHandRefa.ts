#!/usr/bin/env node
'use strict';

import PrefScoreHand from './prefScoreHand';

export default class PrefScoreHandRefa extends PrefScoreHand {
	constructor() {
		super();
	}

	get refa() {
		return true;
	}

	set repealed(repealed: boolean) {
		throw new Error('PrefScoreHand::set repealed:Invalid! Cannot have a refa hand repealed.');
	}

	get repealed() {
		throw new Error('PrefScoreHand::set repealed:Invalid! Cannot have a refa hand repealed.');
	}

}

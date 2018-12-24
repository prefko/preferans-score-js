#!/usr/bin/env node
"use strict";

import PrefScoreHand from "./prefScoreHand";

export default class PrefScoreHandRefa extends PrefScoreHand {
	constructor(id: number) {
		super(id);
	}

	get refa() {
		return true;
	}
}

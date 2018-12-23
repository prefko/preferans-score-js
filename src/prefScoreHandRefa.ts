#!/usr/bin/env node
"use strict";

import PrefScoreHand from "./prefScoreHand";

export default class PrefScoreHandRefa extends PrefScoreHand {
	constructor() {
		super();
	}

	get refa() {
		return true;
	}
}

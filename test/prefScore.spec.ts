#!/usr/bin/env node
"use strict";

import * as _ from 'lodash';
import {expect} from 'chai';

import PrefScore from "../src/prefScore";

describe("PrefScore tests", () => {

	describe("PrefScore classes constructors tests", () => {
		const rand = Math.ceil((Math.random() * 1000)) * 2;
		it("constructors should work", () => {
			expect(() => new PrefScore("cope", "milja", "mitko", rand + 1)).to.throw();
			expect(() => new PrefScore("cope", "milja", "mitko", rand)).to.not.throw();
			expect(new PrefScore("cope", "milja", "mitko", rand)).to.be.an("object");
		});
	});

});

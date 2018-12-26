#!/usr/bin/env node
"use strict";

import {expect} from 'chai';

import PrefScoreHandRefa from "../src/prefScoreHandRefa";

describe("PrefScoreHandRefa tests", () => {

	describe("PrefScoreHandRefa classes constructors tests", () => {
		it("constructors should work", () => {
			expect(() => new PrefScoreHandRefa()).to.not.throw();
			expect(new PrefScoreHandRefa()).to.be.an("object");
		});
	});

	describe("PrefScoreHand methods tests", () => {
		let refa = new PrefScoreHandRefa();
		refa.index = 1;
		it("PrefScoreHand methods should work properly", () => {
			expect(new PrefScoreHandRefa().index).to.be.equal(0);
			expect(() => new PrefScoreHandRefa().repealed).to.throw();
			expect(() => refa.repealed = true).to.throw();
			expect(() => refa.repealed).to.throw();
			expect(refa.index).to.be.equal(1);
			expect(refa.refa).to.be.equal(true);
			expect(refa.game).to.be.equal(false);
		});
	});

});

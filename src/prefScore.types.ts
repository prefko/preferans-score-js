'use strict';

export type PrefDesignation = 'p1' | 'p2' | 'p3';

export type PrefScoreMain = {designation: PrefDesignation; tricks: number; failed: boolean};
export type PrefScoreFollower = {designation: PrefDesignation; followed: boolean; tricks: number; failed: boolean};

/// Copyright (C) 2016 [MonkeyBrush.js]
///
/// Permission is hereby granted, free of charge, to any person obtaining a copy of this
/// software and associated documentation files (the "Software"), to deal in the Software
/// without restriction, including without limitation the rights to use, copy, modify,
/// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
/// permit persons to whom the Software is furnished to do so, subject to the following
/// conditions:
///
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
///
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
/// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
/// OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
/// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
/// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

"use strict";

/// <reference path="../../typings/vanilla-toasts/vanilla-toasts.d.ts" />

namespace MB {
    export namespace ResourceMap {
        export class MapEntry {
            protected _asset: string;
            protected _refCount: number;
            /**
             * MapEntry constructor
             * @param {string} resName Resource name
             */
            constructor(resName: string) {
                this._asset = resName;
                this._refCount = 1;
            };
            /**
             * Return asset name
             * @return {string} [description]
             */
            public getAsset(): string {
                return this._asset;
            };
            /**
             * Set asset name
             * @param {string} name New asset name
             */
            public setAsset(name: string) {
                this._asset = name;
            };
            /**
             * Return asset counter
             * @return {number} Number of uses of this asset
             */
            public count(): number {
                return this._refCount;
            };
            /**
             * Increment asset counter.
             */
            public incCount() {
                this._refCount++;
            };
            /**
             * Decrement asset counter.
             */
            public decCount() {
                this._refCount--;
            };
        };
        /**
         * Number of resources per load.
         * @type {number}
         */
        let _numOutstandingLoads: number = 0;
        /**
         * All resources finished loading callback.
         * @type {Function}
         */
        let _loadCompleteCallback: Function = null;
        /**
         * [MapEntry description]
         * @type {[key: string]: MapEntry;}
         */
        export let _ResourceMap: { [ key: string ]: MapEntry; } = {};
        /**
         * Create an asynchronous request to load a resource.
         * @param {string} resName Resource name.
         */
        export function asyncLoadRequested(resName: string) {
            _ResourceMap[resName] = new MapEntry(resName);
            ++_numOutstandingLoads;
        };
        /**
         * Ends resource load with failed.
         * @param {string} resName Resource name.
         */
        export function asyncLoadFailed(resName: string) {
            VanillaToasts.create({
                title: `${resName} completed`,
                text: "",
                type: "error",
                timeout: 2500
            });
            --_numOutstandingLoads;
            _checkForAllLoadCompleted();
        }
        /**
         * Calling this function when the resource is loaded correctly.
         * @param {string} resName     Resource name.
         * @param {any} loadedAsset Resource object.
         */
        export function asyncLoadCompleted(resName: string, loadedAsset: any) {
            if (!isAssetLoaded(resName)) {
                VanillaToasts.create({
                    title: `asyncLoadCompleted: [${resName}] not in map!`,
                    text: "",
                    type: "error",
                    timeout: 2500
                });
            }
            _ResourceMap[resName].setAsset(loadedAsset);
            --_numOutstandingLoads;
            _checkForAllLoadCompleted();
        };
        /**
         * Check if all resources are loaded.
         */
        function _checkForAllLoadCompleted() {
            if ((_numOutstandingLoads === 0) && (_loadCompleteCallback !== null)) {
                let funToCall = _loadCompleteCallback;
                _loadCompleteCallback = null;
                funToCall();
            }
        };
        /**
         * Set callback function that called when all assets
         *     have finished loading.
         * @param {Function}
         */
        export function setLoadCompleteCallback(fn) {
            _loadCompleteCallback = fn;
            _checkForAllLoadCompleted();
        };
        /**
         * Return asset from alias/name
         * @param  {string} resName [description]
         * @return {any}
         */
        export function retrieveAsset(resName: string): any {
            let r = null;
            if (resName in _ResourceMap) {
                r = _ResourceMap[resName].getAsset();
            } else {
                alert(`retrieveAsset: [${resName}] not in map!`);
            }
            return r;
        };
        /**
         * Check whether the resource has already been loaded.
         * @param  {string} resName: Resource name
         * @return {boolean}: True if resource exist
         */
        export function isAssetLoaded(resName: string): boolean {
            return (resName in _ResourceMap);
        };
        /**
         * @param {string}
         */
        export function incAssetRefCount (resName: string) {
            _ResourceMap[resName].incCount();
        };
        /**
         * Unload a existing resource.
         * @param {string}
         */
        export function unloadAsset (resName: string) {
            let c = 0;
            if (resName in _ResourceMap) {
                _ResourceMap[resName].decCount();
                c = _ResourceMap[resName].count();
                if (c === 0) {
                    delete _ResourceMap[resName];
                }
            }
            return c;
        };
    };
};

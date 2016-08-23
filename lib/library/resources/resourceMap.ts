/// <reference path="../../typings/vanilla-toasts/vanilla-toasts.d.ts" />

"use strict";

namespace ResourceMap {
    export class MapEntry {
        public _asset: string;
        public _refCount: number;
        constructor(resName: string) {
            this._asset = resName;
            this._refCount = 1;
        }
        public getAsset(): string { return this._asset; }
        public setAsset(name: string) {
            this._asset = name;
        }
        public count(): number {
            return this._refCount;
        }
        public incCount() {
            this._refCount++;
        }
        public decCount() {
            this._refCount--;
        }
    }
    /**
     * [_numOutstandingLoads description]
     * @type {number}
     */
    let _numOutstandingLoads: number = 0;
    /**
     * [_loadCompleteCallback description]
     * @type {Function}
     */
    let _loadCompleteCallback: Function = null;
    /**
     * [MapEntry description]
     * @type {[type]}
     */
    export let _resourceMap: { [ key: string ]: MapEntry; } = {};
    /**
     * @param {string}
     */
    export function asyncLoadRequested(resName: string) {
        _resourceMap[resName] = new MapEntry(resName);
        ++_numOutstandingLoads;
    };
    /**
     * @param {string}
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
     * @param {string}
     * @param {[type]}
     */
    export function asyncLoadCompleted(resName: string, loadedAsset) {
        if (!isAssetLoaded(resName)) {
            VanillaToasts.create({
                title: `asyncLoadCompleted: [${resName}] not in map!`,
                text: "",
                type: "error",
                timeout: 2500
            });
        }
        VanillaToasts.create({
            title: `${resName} completed`,
            text: "",
            type: "success",
            timeout: 1500
        });
        _resourceMap[resName].setAsset(loadedAsset);
        --_numOutstandingLoads;
        _checkForAllLoadCompleted();
    };
    /**
     *
     */
    function _checkForAllLoadCompleted() {
        if ((_numOutstandingLoads === 0) && (_loadCompleteCallback !== null)) {
            let funToCall = _loadCompleteCallback;
            _loadCompleteCallback = null;
            funToCall();
        }
    };
    /**
     * Set callback function that called when all assets have finished loading.
     * @param {Function}
     */
    export function setLoadCompleteCallback(fn) {
        _loadCompleteCallback = fn;
        _checkForAllLoadCompleted();
    };
    /**
     * Get asset from alias/name
     * @param  {string} resName [description]
     * @return {any}
     */
    export function retrieveAsset(resName: string): any {
        let r = null;
        if (resName in _resourceMap) {
            r = _resourceMap[resName].getAsset();
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
        return (resName in _resourceMap);
    };
    /**
     * @param {string}
     */
    export function incAssetRefCount (resName: string) {
        _resourceMap[resName].incCount();
    };
    /**
     * Unload a existing resource.
     * @param {string}
     */
    export function unloadAsset (resName: string) {
        let c = 0;
        if (resName in _resourceMap) {
            _resourceMap[resName].decCount();
            c = _resourceMap[resName].count();
            if (c === 0) {
                delete _resourceMap[resName];
            }
        }
        return c;
    };
};

export default ResourceMap;
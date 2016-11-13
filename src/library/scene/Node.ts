namespace MBSX {
    export class Node {
        protected _id: string;

        protected _isEnabled: boolean = true;

        public isEnabled(): boolean {
            if (!this._isEnabled) {
                return false;
            }

            if (this.parent) {
                return this.parent.isEnabled();
            }

            return true;
        };
        public hasParent(): boolean {
            return this.parent !== null;
        };
        public setEnabled(v: boolean) {
            this._isEnabled = v;
        };
        protected _generateUUID(): string {
            let d = new Date().getTime();
            let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        protected _name: string;
        public get name(): string { return this._name; };
        public set name(n: string) { this._name = n; };
        constructor(name: string = "dummy") {
            this._name = name;
            this._id = this._generateUUID();
            this._children = new Array<Node>();
            this._components = new Array<Component>();
            this._parent = null;
            this._transform = new Transform();
        };
        public get parent(): Node { return this._parent; };
        public set parent(p: Node) {
            // TODO: Check parent in p node (addChild or removeChild in p.parent)
            this._parent = p;
        };
        public addChild(n: Node) {
            n.parent = this;
            this._children.push(n);
        };
        public removeChild(n: Node) {
            let idx = this._children.indexOf(n);
            if (idx !== -1) {
                this._children.splice(idx, 1);
            }
        };
        public addComponent(c: Component) {
            c.node = this;
            this._components.push(c);
        }
        public get transform(): Transform { return this._transform; };
        public get children(): Array<Node> { return this._children; };
        protected _parent: Node;
        protected _children: Array<Node>;
        public _components: Array<Component>;
        protected _transform: Transform;

        public get worldPosition(): MB.Vect3 {
            let res = new MB.Vect3();
            this._updateMatrixWorld(true);
            return res.setFromMatrixPosition(this.transform._matrixWorld);
        };
        public get worldScale(): MB.Vect3 {
            let res = new MB.Vect3();
            let p = new MB.Vect3();
            let q = new MB.Quat();
            this._updateMatrixWorld(true);
            this.transform._matrixWorld.decompose(p, q, res);
            return res;
        };

        public _updateMatrixWorld(force: boolean = false) {
            if (this.transform._autoUpdate === true) {
                this.transform.updateMatrix();
            }
            if (this.transform._matrixWorldNeedUpdate === true || force === true) {
                if (!this.parent) {
                    this.transform._matrixWorld.copy(this.transform._matrix);
                } else {
                    this.parent.transform._matrixWorld.mult(this.transform._matrix, this.transform._matrixWorld);
                }

                this.transform._matrixWorldNeedUpdate = false;

                force = true;
            }
            for (let i = 0, l = this._children.length; i < l; ++i) {
                this._children[i]._updateMatrixWorld(force);
            }
        };
        public removeAll() {
            // TODO: Clear Nodes ...
            this._children.length = 0;
        };
        public findByName(name: string) {
            return this._searchElem(name, this);
        }
        protected _searchElem(name: string, elem: MBSX.Node): MBSX.Node {
            if (elem._name === name) {
                return elem;
            }
            // Search in childrens
            for (let i = 0, l = elem._children.length; i < l; ++i) {
                let children = this._searchElem(name, elem._children[i]);
                if (children) {
                    return children;
                }
            }
        };
        // TODO: Search by tag, type, layer ...
    };
};

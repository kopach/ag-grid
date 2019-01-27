import {HdpiCanvas} from "../canvas/hdpiCanvas";
import {Node} from "./node";
import {Path2D} from "./path2D";
import {Shape} from "./shape/shape";
import {Parent} from "./parent";

export class Scene {
    constructor(parent: HTMLElement, width = 800, height = 600) {
        this.hdpiCanvas = new HdpiCanvas(this._width = width, this._height = height);
        const canvas = this.hdpiCanvas.canvas;
        this.ctx = canvas.getContext('2d')!;
        parent.appendChild(canvas);
        this.setupListeners(canvas); // debug
    }

    private readonly hdpiCanvas: HdpiCanvas;
    private readonly ctx: CanvasRenderingContext2D;

    private setupListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousemove', this.onMouseMove);
    }

    private lastHit?: { // debug
        node: Shape,
        fillStyle: string | null
    };
    private onMouseMove = (e: MouseEvent) => { // debug
        const x = e.offsetX;
        const y = e.offsetY;

        if (this.root) {
            const node = this.hitTestPath(this.root, x, y);
            if (node) {
                if (node instanceof Shape) {
                    if (!this.lastHit) {
                        this.lastHit = { node, fillStyle: node.fillStyle };
                    } else if (this.lastHit.node !== node) {
                        this.lastHit.node.fillStyle = this.lastHit.fillStyle;
                        this.lastHit = { node, fillStyle: node.fillStyle };
                    }
                    node.fillStyle = 'yellow';
                }
            } else if (this.lastHit) {
                this.lastHit.node.fillStyle = this.lastHit.fillStyle;
                this.lastHit = undefined;
            }
        }
    };

    hitTestPath(node: Node, x: number, y: number): Node | undefined {
        if (node instanceof Parent) {
            const children = node.children;
            const n = node.children.length;
            // Group nodes added later should be hit-tested first,
            // as they are rendered on top of previously added nodes.
            for (let i = n - 1; i >= 0; i--) {
                const hit = this.hitTestPath(children[i], x, y);
                if (hit)
                    return hit;
            }
        } else if (node instanceof Shape && node.isPointInPath(x, y)) {
            return node;
        }
    }

    _width: number;
    get width(): number {
        return this._width;
    }

    _height: number;
    get height(): number {
        return this._height;
    }

    set size(value: [number, number]) {
        this.hdpiCanvas.resize(value[0], value[1]);
        [this._width, this._height] = value;
    }

    _dirty = false;
    set dirty(dirty: boolean) {
        if (dirty && !this._dirty) {
            requestAnimationFrame(this.render);
        }
        this._dirty = dirty;
    }
    get dirty(): boolean {
        return this._dirty;
    }

    _root?: Node;
    set root(node: Node | undefined) {
        this._root = node;
        if (node) {
            node.scene = this;
        }
        this.dirty = true;
    }
    get root(): Node | undefined {
        return this._root;
    }

    appendPath(path: Path2D) {
        const ctx = this.ctx;
        const commands = path.commands;
        const params = path.params;
        const n = commands.length;
        let j = 0;

        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            switch (commands[i]) {
                case 'M':
                    ctx.moveTo(params[j++], params[j++]);
                    break;
                case 'L':
                    ctx.lineTo(params[j++], params[j++]);
                    break;
                case 'C':
                    ctx.bezierCurveTo(
                        params[j++], params[j++],
                        params[j++], params[j++],
                        params[j++], params[j++]
                    );
                    break;
                case 'Z':
                    ctx.closePath();
                    break;
            }
        }
    }

    private _frameIndex = 0;
    get frameIndex(): number {
        return this._frameIndex;
    }

    _isRenderFrameIndex = true;
    set isRenderFrameIndex(value: boolean) {
        if (this._isRenderFrameIndex !== value) {
            this._isRenderFrameIndex = value;
            this.dirty = true;
        }
    }
    get isRenderFrameIndex(): boolean {
        return this._isRenderFrameIndex;
    }


    render = () => {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.width, this.height);

        if (this.root) {
            ctx.save();
            this.root.render(ctx);
            ctx.restore();
        }

        this._frameIndex++;
        if (this.isRenderFrameIndex) {
            ctx.fillText(this.frameIndex.toString(), 0, 10);
        }

        this.dirty = false;
    };
}
